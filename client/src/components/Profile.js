import React, { useState } from 'react';
import Header from './Header';

function Profile() {
    const [ selectedImage, setSelectedImage ] = useState('');

    const onFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    }

    const onFileUpload = (e) => {

    }

    return (
        <div>
            {/* avatar, username */}
           {/* Create post, Posts, Saved,  */}
           
            {/* Create post should display a popup, where u can upload an image
                and add a caption, then create a post */}

            {/* upload image */}
            <input type="file" onChange={onFileChange} />

        </div>
    )
}

export default Profile
