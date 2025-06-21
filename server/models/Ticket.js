const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Response content is required'],
        trim: true
    },
    isInternal: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ticket title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Ticket description is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['technical', 'billing', 'feature-request', 'bug-report', 'general'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'waiting-for-customer', 'resolved', 'closed'],
        default: 'open'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    responses: [responseSchema],
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    dueDate: {
        type: Date
    },
    resolvedAt: {
        type: Date
    },
    closedAt: {
        type: Date
    },
    satisfaction: {
        type: Number,
        min: 1,
        max: 5
    },
    satisfactionComment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ creator: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ category: 1, status: 1 });

// Virtual for response count
ticketSchema.virtual('responseCount').get(function () {
    return this.responses.length;
});

// Method to add response
ticketSchema.methods.addResponse = function (authorId, content, isInternal = false) {
    this.responses.push({
        author: authorId,
        content,
        isInternal
    });
    return this.save();
};

// Method to update status
ticketSchema.methods.updateStatus = function (newStatus) {
    this.status = newStatus;

    if (newStatus === 'resolved') {
        this.resolvedAt = new Date();
    } else if (newStatus === 'closed') {
        this.closedAt = new Date();
    }

    return this.save();
};

// Pre-save middleware to update timestamps
ticketSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        if (this.status === 'resolved' && !this.resolvedAt) {
            this.resolvedAt = new Date();
        } else if (this.status === 'closed' && !this.closedAt) {
            this.closedAt = new Date();
        }
    }
    next();
});

module.exports = mongoose.model('Ticket', ticketSchema); 