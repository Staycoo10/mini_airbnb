const validateReservationData = (data) => {
  const errors = [];

  // Verifică apartment_id
  if (!data.apartment_id) {
    errors.push("Apartment ID is required");
  } else {
    const aptId = parseInt(data.apartment_id);
    if (isNaN(aptId) || aptId <= 0) {
      errors.push("Apartment ID must be a valid positive number");
    }
  }

  // Verifică start_date
  if (!data.start_date) {
    errors.push("Start date is required");
  } else {
    const startDate = new Date(data.start_date);
    if (isNaN(startDate.getTime())) {
      errors.push("Start date must be a valid date");
    }
  }

  // Verifică end_date
  if (!data.end_date) {
    errors.push("End date is required");
  } else {
    const endDate = new Date(data.end_date);
    if (isNaN(endDate.getTime())) {
      errors.push("End date must be a valid date");
    }
  }

  // Verifică că end_date > start_date
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    
    if (endDate <= startDate) {
      errors.push("End date must be after start date");
    }

    // Verifică că start_date nu e în trecut
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      errors.push("Start date cannot be in the past");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateReservationData };