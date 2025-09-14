import React from 'react';
import { UserIcon } from '../UI/Icons';

const ProfileModal = ({ showProfile, closeProfile, profileLoading, profileError, profileData }) => {
    if (!showProfile) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30" onClick={closeProfile}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">👤 Profile Details</h3>
                        <button
                            onClick={closeProfile}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {profileLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading profile...</p>
                        </div>
                    ) : profileError ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 text-lg">{profileError}</p>
                        </div>
                    ) : profileData ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <UserIcon className="w-12 h-12 text-emerald-600" />
                                <div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {profileData.user?.firstName} {profileData.user?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{profileData.user?.email}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Organization Type</div>
                                    <div className="text-sm font-semibold text-gray-900">{profileData.user?.orgType}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">User ID</div>
                                    <div className="text-sm font-mono text-gray-900 break-all">{profileData.user?.userId}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Phone</div>
                                    <div className="text-sm font-semibold text-gray-900">{profileData.user?.phone}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Location</div>
                                    <div className="text-sm font-semibold text-gray-900">{profileData.user?.location}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Last Login</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {profileData.user?.lastLogin ? 
                                            new Date(profileData.user.lastLogin).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Organization ID</div>
                                    <div className="text-sm font-mono text-gray-900 break-all">{profileData.user?.organizationId}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Status</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                            profileData.user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {profileData.user?.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;