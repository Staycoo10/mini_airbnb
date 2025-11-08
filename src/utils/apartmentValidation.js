const validateApartmentData = (data) => {
  const errors = [];

  // Required fields
  if (!data.title || data.title.trim() === '') {
    errors.push("Title is required");
  }

  if (!data.description || data.description.trim() === '') {
    errors.push("Description is required");
  }

  if (!data.price) {
    errors.push("Price is required");
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      errors.push("Price must be a positive number");
    }
  }

  if (!data.location || data.location.trim() === '') {
    errors.push("Location is required");
  }

  if (!data.rooms) {
    errors.push("Rooms is required");
  } else {
    const rooms = parseInt(data.rooms);
    if (isNaN(rooms) || rooms <= 0) {
      errors.push("Rooms must be a positive integer");
    }
  }

  if (!data.user_id) {
    errors.push("User ID is required");
  } else {
    const userId = parseInt(data.user_id);
    if (isNaN(userId)) {
      errors.push("User ID must be a valid number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateApartmentData };