import React, { useState } from 'react';
import Lottie from 'lottie-react';
import orderAnimation from '../animations/HelpGrow.json';

const GroupForm = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    members: [''],
  });

  const [memberCount, setMemberCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleGroupNameChange = (e) => {
    setFormData({ ...formData, groupName: e.target.value });
  };

  const handleMemberCountChange = (e) => {
    const count = parseInt(e.target.value);
    setMemberCount(count);
    setFormData({ ...formData, members: Array(count).fill('') });
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = value;
    setFormData({ ...formData, members: updatedMembers });
  };
const handleSubmit = (e) => {
  e.preventDefault();

  const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
  const newGroup = {
    groupName: formData.groupName,
    members: formData.members,
  };

  savedGroups.push(newGroup);
  localStorage.setItem('groups', JSON.stringify(savedGroups));

  alert(`Group "${formData.groupName}" saved with ${memberCount} members`);
  setFormData({ groupName: '', members: [] });
  setMemberCount(1);
  setIsEditing(false);
};


  const handleEdit = () => {
    setIsEditing(true);
    setSubmitted(false);
  };

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Lottie animationData={orderAnimation} loop={true} style={{ height: '350px', width: '100%' }} />
        </div>

        <div style={formBoxStyle}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {isEditing ? 'Edit Group' : 'Create Group'}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Group Name"
              value={formData.groupName}
              onChange={handleGroupNameChange}
              required
              style={inputStyle}
              disabled={!isEditing && submitted}
            />

            <select
              value={memberCount}
              onChange={handleMemberCountChange}
              style={inputStyle}
              disabled={!isEditing && submitted}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} Members
                </option>
              ))}
            </select>

            {formData.members.map((member, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Member ${index + 1}`}
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                style={inputStyle}
                required
                disabled={!isEditing && submitted}
              />
            ))}

            <button type="submit" style={buttonStyle}>
              {isEditing ? 'Update' : 'Submit'}
            </button>

            {!isEditing && submitted && (
              <button
                type="button"
                style={{ ...buttonStyle, backgroundColor: '#007bff', marginTop: '10px' }}
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
};

const innerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '30px',
  maxWidth: '1000px',
  width: '100%',
};

const formBoxStyle = {
  flex: 1,
  backgroundColor: '#fff',
  padding: '25px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default GroupForm;
