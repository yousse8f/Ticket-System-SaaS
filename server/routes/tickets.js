const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/tickets
// @desc    Create a new ticket
// @access  Private
router.post('/', [
    auth,
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('category').isIn(['technical', 'billing', 'feature-request', 'bug-report', 'general']).withMessage('Invalid category'),
    body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, category, priority, tags } = req.body;

        const ticket = new Ticket({
            title,
            description,
            category,
            priority,
            tags: tags || [],
            creator: req.user._id
        });

        await ticket.save();

        // Populate creator details
        await ticket.populate('creator', 'name email company');

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket
        });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tickets
// @desc    Get all tickets (with filtering and pagination)
// @access  Private
router.get('/', [
    auth,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['open', 'in-progress', 'waiting-for-customer', 'resolved', 'closed']).withMessage('Invalid status'),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    query('category').optional().isIn(['technical', 'billing', 'feature-request', 'bug-report', 'general']).withMessage('Invalid category'),
    query('search').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            page = 1,
            limit = 10,
            status,
            priority,
            category,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};

        // Role-based filtering
        if (req.user.role === 'user') {
            filter.creator = req.user._id;
        } else if (req.user.role === 'support') {
            filter.$or = [
                { assignedTo: req.user._id },
                { assignedTo: { $exists: false } },
                { assignedTo: null }
            ];
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        // Search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const tickets = await Ticket.find(filter)
            .populate('creator', 'name email company')
            .populate('assignedTo', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Ticket.countDocuments(filter);

        res.json({
            tickets,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalTickets: total,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('creator', 'name email company')
            .populate('assignedTo', 'name email')
            .populate('responses.author', 'name email role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check access permissions
        if (req.user.role === 'user' && ticket.creator._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ ticket });
    } catch (error) {
        console.error('Get ticket error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket
// @access  Private (Admin/Support or ticket creator)
router.put('/:id', [
    auth,
    body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('category').optional().isIn(['technical', 'billing', 'feature-request', 'bug-report', 'general']).withMessage('Invalid category'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('status').optional().isIn(['open', 'in-progress', 'waiting-for-customer', 'resolved', 'closed']).withMessage('Invalid status'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check permissions
        const canEdit = req.user.role === 'admin' ||
            req.user.role === 'support' ||
            ticket.creator.toString() === req.user._id.toString();

        if (!canEdit) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update fields
        const updateFields = {};
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.description) updateFields.description = req.body.description;
        if (req.body.category) updateFields.category = req.body.category;
        if (req.body.priority) updateFields.priority = req.body.priority;
        if (req.body.status) updateFields.status = req.body.status;
        if (req.body.tags !== undefined) updateFields.tags = req.body.tags;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        )
            .populate('creator', 'name email company')
            .populate('assignedTo', 'name email')
            .populate('responses.author', 'name email role');

        res.json({
            message: 'Ticket updated successfully',
            ticket: updatedTicket
        });
    } catch (error) {
        console.error('Update ticket error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/tickets/:id/responses
// @desc    Add response to ticket
// @access  Private
router.post('/:id/responses', [
    auth,
    body('content').trim().isLength({ min: 1 }).withMessage('Response content is required'),
    body('isInternal').optional().isBoolean().withMessage('isInternal must be a boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check access permissions
        const canRespond = req.user.role === 'admin' ||
            req.user.role === 'support' ||
            ticket.creator.toString() === req.user._id.toString();

        if (!canRespond) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { content, isInternal = false } = req.body;

        // Only admin/support can add internal responses
        if (isInternal && !['admin', 'support'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only staff can add internal responses' });
        }

        await ticket.addResponse(req.user._id, content, isInternal);

        // Populate the updated ticket
        await ticket.populate('creator', 'name email company');
        await ticket.populate('assignedTo', 'name email');
        await ticket.populate('responses.author', 'name email role');

        res.json({
            message: 'Response added successfully',
            ticket
        });
    } catch (error) {
        console.error('Add response error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/tickets/:id/assign
// @desc    Assign ticket to support staff
// @access  Private (Admin/Support only)
router.put('/:id/assign', [
    auth,
    authorize('admin', 'support'),
    body('assignedTo').isMongoId().withMessage('Valid user ID required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignedTo } = req.body;

        // Check if assigned user exists and is support/admin
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser || !['admin', 'support'].includes(assignedUser.role)) {
            return res.status(400).json({ message: 'Invalid user for assignment' });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { assignedTo },
            { new: true, runValidators: true }
        )
            .populate('creator', 'name email company')
            .populate('assignedTo', 'name email')
            .populate('responses.author', 'name email role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({
            message: 'Ticket assigned successfully',
            ticket
        });
    } catch (error) {
        console.error('Assign ticket error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/tickets/:id/satisfaction
// @desc    Rate ticket satisfaction
// @access  Private (Ticket creator only)
router.post('/:id/satisfaction', [
    auth,
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment too long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Only ticket creator can rate satisfaction
        if (ticket.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Only resolved/closed tickets can be rated
        if (!['resolved', 'closed'].includes(ticket.status)) {
            return res.status(400).json({ message: 'Can only rate resolved or closed tickets' });
        }

        const { rating, comment } = req.body;

        ticket.satisfaction = rating;
        if (comment) ticket.satisfactionComment = comment;

        await ticket.save();

        res.json({
            message: 'Satisfaction rating submitted successfully',
            ticket
        });
    } catch (error) {
        console.error('Rate satisfaction error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket (Admin only)
// @access  Private (Admin only)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Delete ticket error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 