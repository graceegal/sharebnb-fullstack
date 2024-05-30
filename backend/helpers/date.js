/** takes date and formats it to MM/DD/YYYY */
function formatDate(date) {
  return date.toLocaleDateString('en-US');
}

module.exports = {formatDate};