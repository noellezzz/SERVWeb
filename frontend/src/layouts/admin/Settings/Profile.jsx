import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState } from "react";

const Profile = () => {
  const [image, setImage] = useState('/src/assets/pssy.jpg'); // Default profile image
  const [editingImage, setEditingImage] = useState(false); // State to manage image editing

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Temporary image display before saving
    }
    setEditingImage(false); // Close editing mode after selection
  };

  return (
    <SettingSection icon={User} title={"Employee Profile"}>
      {/* Profile Information */}
      <div className='flex flex-col sm:flex-row items-center bg-white shadow-md rounded-md p-6 mb-8'>
        {/* Profile Image with click-to-edit */}
        <div className='relative'>
          <img
            src={image}
            alt='Profile'
            className='rounded-full w-32 h-32 object-cover cursor-pointer'
            onClick={() => setEditingImage(true)} // Trigger image editing
          />
          {editingImage && (
            <div className="absolute bottom-0 right-0 p-2 bg-white bg-opacity-100 rounded-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="text-white cursor-pointer text-xs">
                Update
              </label>
            </div>
          )}
        </div>
        
        <div className='ml-4'>
          <h3 className='text-xl font-semibold text-white-800'>John Doe</h3>
          <p className='text-sm text-white-500'>admin@company.com</p>
          <p className='text-sm text-white-400 mt-1'>Role: Admin</p>
        </div>
      </div>

      {/* Additional Settings Section */}
      <div className="settings-actions mb-6">
        <h4 className="text-lg font-medium text-white-700 mb-2">Settings</h4>
        <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-200 w-full sm:w-auto'>
          Edit Profile
        </button>
      </div>
    </SettingSection>
  );
};

export default Profile;
