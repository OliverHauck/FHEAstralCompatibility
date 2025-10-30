import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { CONFIG } from '../config/contract';
import './CreateProfile.css';

const CreateProfile = () => {
  const { account, hasProfile, createProfile, updateProfile, showLoading, hideLoading, showNotification } = useWeb3();
  const [selectedZodiac, setSelectedZodiac] = useState('');

  const handleZodiacChange = (e) => {
    setSelectedZodiac(e.target.value);
  };

  const handleCreateProfile = async () => {
    if (!account) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    if (!selectedZodiac) {
      showNotification('Please select your zodiac sign', 'error');
      return;
    }

    try {
      showLoading('Creating your private profile...');
      await createProfile(parseInt(selectedZodiac));
      hideLoading();
      showNotification('Profile created successfully! Your zodiac information is now encrypted and private.', 'success');
    } catch (error) {
      hideLoading();
      console.error('Error creating profile:', error);
      showNotification('Failed to create profile: ' + error.message, 'error');
    }
  };

  const handleUpdateProfile = async () => {
    if (!account) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    if (!selectedZodiac) {
      showNotification('Please select your zodiac sign', 'error');
      return;
    }

    try {
      showLoading('Updating your profile...');
      await updateProfile(parseInt(selectedZodiac));
      hideLoading();
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      hideLoading();
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile: ' + error.message, 'error');
    }
  };

  const selectedZodiacInfo = selectedZodiac ? CONFIG.ZODIAC_SIGNS[parseInt(selectedZodiac)] : null;

  return (
    <section id="create-profile" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Create Your Astrological Profile</h2>
          <p>Your zodiac information will be encrypted and kept private using FHE technology</p>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="zodiacSelect">Your Zodiac Sign</label>
            <select
              id="zodiacSelect"
              className="form-control"
              value={selectedZodiac}
              onChange={handleZodiacChange}
            >
              <option value="">Select your zodiac sign</option>
              {CONFIG.ZODIAC_SIGNS.map((zodiac) => (
                <option key={zodiac.id} value={zodiac.id}>
                  {zodiac.name}
                </option>
              ))}
            </select>
            <small className="form-text">Choose your astrological sign based on your birth date</small>
          </div>

          {selectedZodiacInfo && (
            <div className="zodiac-info">
              <div className="info-card">
                <h4>{selectedZodiacInfo.name}</h4>
                <div className="zodiac-details">
                  <span className="detail">
                    Element: <span>{CONFIG.ELEMENTS[selectedZodiacInfo.element]}</span>
                  </span>
                  <span className="detail">
                    Quality: <span>{CONFIG.QUALITIES[selectedZodiacInfo.quality]}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {!hasProfile ? (
              <button
                className="btn btn-primary"
                onClick={handleCreateProfile}
                disabled={!selectedZodiac}
              >
                Create Private Profile
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={handleUpdateProfile}
                disabled={!selectedZodiac}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProfile;
