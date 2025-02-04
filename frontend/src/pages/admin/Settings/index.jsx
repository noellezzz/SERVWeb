import React from 'react';
import Profile from '@/layouts/admin/Settings/Profile';


const Settings = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10 '>
            <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                <Profile />

            </main>
        </div>
    );
};

export default Settings;
