const sendOnButton = document.getElementById('gift-card-recipient-send-on-button');
const instantButton = document.getElementById('gift-card-recipient-send-instant-button');
const sendOnDate = document.getElementById('recipient-send-on');

if (sendOnButton) {
  sendOnButton.addEventListener('click', () => {
    sendOnButton.style.border = '1px solid #000';
    instantButton.style.border = '1px solid #d1d1d1';
    sendOnDate.style.display = 'block';
  });
}

if (instantButton) {
  instantButton.addEventListener('click', () => {
    instantButton.style.border = '1px solid #000';
    sendOnButton.style.border = '1px solid #d1d1d1';
    sendOnDate.style.display = 'none';
    document.getElementById('recipient-send-on').value = '';
  });
}
