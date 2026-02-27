// AI Meeting Summarizer - Dashboard JavaScript
const meetingsList = document.getElementById('meetingsList');
const uploadMeetingBtn = document.getElementById('uploadMeetingBtn');
const uploadModal = document.getElementById('uploadModal');
const meetingModal = document.getElementById('meetingModal');
const uploadMeetingForm = document.getElementById('uploadMeetingForm');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

let currentUser = null;
let allMeetings = [];
let currentMeetingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadMeetings();
    await loadStats();

    // Event listeners
    uploadMeetingBtn.addEventListener('click', () => openUploadModal());
    document.getElementById('closeUploadModal').addEventListener('click', closeUploadModal);
    document.getElementById('cancelUpload').addEventListener('click', closeUploadModal);
    document.getElementById('closeMeetingModal').addEventListener('click', closeMeetingModal);
    document.getElementById('closeMeetingDetail').addEventListener('click', closeMeetingModal);
    document.getElementById('deleteMeetingBtn').addEventListener('click', handleDeleteMeeting);

    uploadMeetingForm.addEventListener('submit', handleUploadMeeting);
    logoutBtn.addEventListener('click', handleLogout);

    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) closeUploadModal();
    });

    meetingModal.addEventListener('click', (e) => {
        if (e.target === meetingModal) closeMeetingModal();
    });
});

// Auth
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();

        if (!data.authenticated) {
            window.location.href = '/';
            return;
        }

        currentUser = data.user;
        document.getElementById('currentUser').textContent = currentUser.email;
    } catch (error) {
        window.location.href = '/';
    }
}

async function handleLogout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        showToast('Logout failed', 'error');
    }
}

// Meetings
async function loadMeetings() {
    try {
        meetingsList.innerHTML = '<p class="loading">Loading meetings...</p>';

        const response = await fetch('/api/meetings');
        const data = await response.json();

        allMeetings = data.meetings;

        if (allMeetings.length === 0) {
            meetingsList.innerHTML = '<p class="empty-state">No meetings yet. Upload your first meeting transcript to get started!</p>';
            return;
        }

        meetingsList.innerHTML = allMeetings
            .map(meeting => createMeetingCard(meeting))
            .join('');

        // Attach event listeners
        document.querySelectorAll('.meeting-card').forEach(card => {
            card.addEventListener('click', () => openMeetingDetail(card.dataset.meetingId));
        });

    } catch (error) {
        meetingsList.innerHTML = '<p class="empty-state">Error loading meetings. Please try again.</p>';
    }
}

async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        document.getElementById('totalMeetings').textContent = data.total_meetings;
        document.getElementById('totalHours').textContent = data.total_hours + 'h';
        document.getElementById('avgDuration').textContent = data.avg_duration + 'm';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function createMeetingCard(meeting) {
    const createdAt = new Date(meeting.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const participants = meeting.participants.length > 0
        ? meeting.participants.join(', ')
        : 'No participants identified';

    const actionCount = meeting.action_items.length;
    const keyPointsCount = meeting.key_points.length;

    return `
        <div class="meeting-card" data-meeting-id="${meeting.meeting_id}">
            <div class="meeting-header">
                <h3>${escapeHtml(meeting.title)}</h3>
                <span class="meeting-date">${createdAt}</span>
            </div>
            <div class="meeting-summary">
                ${escapeHtml(meeting.summary.substring(0, 200))}${meeting.summary.length > 200 ? '...' : ''}
            </div>
            <div class="meeting-meta">
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2C6.9 2 6 2.9 6 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 9c-2.7 0-5.8 1.3-6 2v1h12v-1c-.2-.7-3.3-2-6-2z"/>
                    </svg>
                    ${participants}
                </span>
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm.5-10H7v5l4.2 2.5.8-1.2-3.5-2V4z"/>
                    </svg>
                    ${meeting.duration_minutes} min
                </span>
                <span class="meta-item">
                    ${actionCount} action ${actionCount === 1 ? 'item' : 'items'}
                </span>
                <span class="meta-item">
                    ${keyPointsCount} key ${keyPointsCount === 1 ? 'point' : 'points'}
                </span>
            </div>
        </div>
    `;
}

// Upload meeting
function openUploadModal() {
    uploadModal.classList.add('active');
    uploadMeetingForm.reset();
}

function closeUploadModal() {
    uploadModal.classList.remove('active');
}

async function handleUploadMeeting(e) {
    e.preventDefault();

    const formData = new FormData(uploadMeetingForm);
    const meetingData = {
        title: formData.get('title'),
        transcript: formData.get('transcript'),
    };

    // Show loading state
    const submitBtn = uploadMeetingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Analyzing...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meetingData),
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Meeting analyzed successfully', 'success');
            closeUploadModal();
            await loadMeetings();
            await loadStats();

            // Open the newly created meeting
            setTimeout(() => openMeetingDetail(data.meeting_id), 300);
        } else {
            showToast(data.error || 'Failed to analyze meeting', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Meeting detail
async function openMeetingDetail(meetingId) {
    try {
        const response = await fetch(`/api/meetings/${meetingId}`);
        const meeting = await response.json();

        if (!response.ok) {
            showToast('Failed to load meeting', 'error');
            return;
        }

        currentMeetingId = meetingId;

        // Populate modal
        document.getElementById('detailTitle').textContent = meeting.title;

        const createdDate = new Date(meeting.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        document.getElementById('detailDate').textContent = createdDate;
        document.getElementById('detailDuration').textContent = `${meeting.duration_minutes} minutes`;

        const participantsText = meeting.participants.length > 0
            ? meeting.participants.join(', ')
            : 'No participants identified';
        document.getElementById('detailParticipants').textContent = participantsText;

        document.getElementById('detailSummary').textContent = meeting.summary;

        // Action items
        const actionItemsList = document.getElementById('detailActionItems');
        if (meeting.action_items.length > 0) {
            actionItemsList.innerHTML = meeting.action_items
                .map(item => `<li>${escapeHtml(item)}</li>`)
                .join('');
        } else {
            actionItemsList.innerHTML = '<li class="no-items">No action items identified</li>';
        }

        // Key points
        const keyPointsList = document.getElementById('detailKeyPoints');
        if (meeting.key_points.length > 0) {
            keyPointsList.innerHTML = meeting.key_points
                .map(point => `<li>${escapeHtml(point)}</li>`)
                .join('');
        } else {
            keyPointsList.innerHTML = '<li class="no-items">No key points identified</li>';
        }

        // Transcript
        document.getElementById('detailTranscript').textContent = meeting.transcript;

        meetingModal.classList.add('active');
    } catch (error) {
        showToast('Error loading meeting details', 'error');
    }
}

function closeMeetingModal() {
    meetingModal.classList.remove('active');
    currentMeetingId = null;
}

async function handleDeleteMeeting() {
    if (!currentMeetingId) return;

    if (!confirm('Are you sure you want to delete this meeting? This cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`/api/meetings/${currentMeetingId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Meeting deleted successfully', 'success');
            closeMeetingModal();
            await loadMeetings();
            await loadStats();
        } else {
            const data = await response.json();
            showToast(data.error || 'Failed to delete meeting', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

// Utilities
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
