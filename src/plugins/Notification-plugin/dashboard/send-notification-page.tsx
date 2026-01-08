import {
    Button,
    Page,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@vendure/dashboard';
import { useState } from 'react';

export function SendNotificationPage() {
    // Form state
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState<'all' | 'role' | 'specific'>('all');
    const [selectedRole, setSelectedRole] = useState('');
    const [userIds, setUserIds] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous messages
        setError(null);
        setSuccess(null);
        
        // Validate form
        if (!title.trim() || !message.trim()) {
            setError('Title and message are required');
            return;
        }
        
        setLoading(true);
        
        try {
            // Prepare input based on recipient type
            const input: any = {
                title,
                message,
                toAll: recipientType === 'all',
            };
            
            if (recipientType === 'role' && selectedRole) {
                input.role = selectedRole;
            }
            
            if (recipientType === 'specific' && userIds) {
                input.userIds = userIds.split(',').map(id => id.trim());
            }
            
            // Call the GraphQL API
            const response = await fetch('/admin-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    query: `
                        mutation CreateNotification($input: CreateNotificationInput!) {
                            createNotification(input: $input) {
                                id
                                title
                                message
                            }
                        }
                    `,
                    variables: { input },
                }),
            });
            
            const result = await response.json();
            
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            
            if (result.data?.createNotification) {
                setSuccess('Notification sent successfully!');
                
                // Reset form
                setTitle('');
                setMessage('');
                setRecipientType('all');
                setSelectedRole('');
                setUserIds('');
                
                // Clear success message after 5 seconds
                setTimeout(() => setSuccess(null), 5000);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Page pageId="send-notification-page">
            <PageTitle>Send Notification</PageTitle>
            <PageLayout>
                <PageBlock column="main" blockId="notification-form">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-800">{success}</p>
                            </div>
                        )}
                        
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                        
                        {/* Title Field */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter notification title"
                                required
                            />
                            <p className="text-xs text-gray-500">The notification title</p>
                        </div>
                        
                        {/* Message Field */}
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter notification message"
                                rows={5}
                                required
                            />
                            <p className="text-xs text-gray-500">The notification message content</p>
                        </div>
                        
                        {/* Recipient Type */}
                        <div className="space-y-2">
                            <label htmlFor="recipientType" className="text-sm font-medium">
                                Send To
                            </label>
                            <select
                                id="recipientType"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value as any)}
                            >
                                <option value="all">All Users</option>
                                <option value="role">Specific Role</option>
                                <option value="specific">Specific Users</option>
                            </select>
                            <p className="text-xs text-gray-500">Choose who should receive this notification</p>
                        </div>
                        
                        {/* Role Selection (conditional) */}
                        {recipientType === 'role' && (
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium">
                                    Role
                                </label>
                                <input
                                    id="role"
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    placeholder="e.g., customer, administrator"
                                />
                                <p className="text-xs text-gray-500">Enter the role code</p>
                            </div>
                        )}
                        
                        {/* User IDs (conditional) */}
                        {recipientType === 'specific' && (
                            <div className="space-y-2">
                                <label htmlFor="userIds" className="text-sm font-medium">
                                    User IDs
                                </label>
                                <input
                                    id="userIds"
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={userIds}
                                    onChange={(e) => setUserIds(e.target.value)}
                                    placeholder="e.g., 1, 2, 3"
                                />
                                <p className="text-xs text-gray-500">Enter comma-separated user IDs</p>
                            </div>
                        )}
                        
                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Notification'}
                            </Button>
                        </div>
                    </form>
                </PageBlock>
                
                {/* Side Panel with Information */}
                <PageBlock column="side" blockId="notification-info">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Notification Guidelines</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Keep titles concise and clear</li>
                            <li>• Messages should be actionable</li>
                            <li>• Consider your audience when choosing recipients</li>
                            <li>• Test with specific users before sending to all</li>
                        </ul>
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}