/**
 * 
 * @param {String} birthDate 
 * @param {String} otherDate 
 * 
 * Format: DD/MM/YYYY
 * 
 * @returns {Number} age 
 */
const calculateAge = (birthDate, otherDate) => {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

module.exports = calculateAge;