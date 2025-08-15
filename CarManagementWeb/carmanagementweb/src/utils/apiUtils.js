/**
 * Utility functions for API calls and data handling
 */

/**
 * Safely set array state from API response
 * @param {any} data - API response data
 * @param {Function} setState - State setter function
 * @param {string} dataName - Name of the data for logging
 */
export const safeSetArrayState = (data, setState, dataName = 'data') => {
  if (Array.isArray(data)) {
    setState(data);
  } else {
    console.error(`${dataName} response is not an array:`, data);
    setState([]);
  }
};

/**
 * Handle API call with error handling and array validation
 * @param {Function} apiCall - API call function
 * @param {Function} setState - State setter function
 * @param {string} dataName - Name of the data for logging
 * @param {Array} fallbackData - Fallback data when API fails (optional)
 */
export const handleApiCall = async (apiCall, setState, dataName = 'data', fallbackData = []) => {
  try {
    console.log(`Loading ${dataName}...`);
    const response = await apiCall();
    console.log(`${dataName} response:`, response.data);

    safeSetArrayState(response.data, setState, dataName);
  } catch (error) {
    console.error(`Error loading ${dataName}:`, error);
    console.error('Error details:', error.response?.data || error.message);

    // Set fallback data or empty array
    setState(fallbackData);
  }
};

/**
 * Format price to Vietnamese currency format
 * @param {number|string} price - Price value
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
  // Handle null, undefined, or empty values
  if (price === null || price === undefined || price === '') {
    return "0 ₫";
  }

  const n = Number(price);

  // Handle NaN or invalid numbers
  if (isNaN(n) || !isFinite(n)) {
    console.warn('Invalid price value:', price);
    return "0 ₫";
  }

  // Format with Vietnamese locale and add currency symbol
  return n.toLocaleString('vi-VN') + ' ₫';
};

/**
 * Format date to Vietnamese format (DD/MM/YYYY)
 * @param {string|Date} dateValue - Date value from API
 * @returns {string} Formatted date
 */
export const formatDate = (dateValue) => {
  // Handle null, undefined, or empty values
  if (!dateValue) {
    return "Không rõ";
  }

  try {
    let date;

    // If it's already a Date object
    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Handle string dates from API
      // Backend sends dates in format "yyyy-MM-dd" or "yyyy-MM-ddTHH:mm:ss"
      date = new Date(dateValue);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return "Không rõ";
    }

    // Format to Vietnamese locale (DD/MM/YYYY)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', dateValue);
    return "Không rõ";
  }
};

/**
 * Format datetime to Vietnamese format (DD/MM/YYYY HH:mm)
 * @param {string|Date} dateValue - Date value from API
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (dateValue) => {
  // Handle null, undefined, or empty values
  if (!dateValue) {
    return "Không rõ";
  }

  try {
    let date;

    // If it's already a Date object
    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Handle string dates from API
      date = new Date(dateValue);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid datetime value:', dateValue);
      return "Không rõ";
    }

    // Format to Vietnamese locale (DD/MM/YYYY HH:mm)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting datetime:', error, 'Date value:', dateValue);
    return "Không rõ";
  }
};

/**
 * Get choice label for gym package duration
 * @param {string} choice - Choice string (e.g., "3-month")
 * @returns {string} Formatted choice label
 */
export const getChoiceLabel = (choice) => {
  if (!choice) return choice;

  const [duration, unit] = choice.split("-");
  const number = parseInt(duration);

  if (unit === "month") return `${number} tháng`;
  if (unit === "quarter") return `${number} quý - ${number * 3} tháng`;
  if (unit === "year") return `${number} năm - ${number * 12} tháng`;
  return choice;
};
