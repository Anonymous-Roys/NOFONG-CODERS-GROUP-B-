// WhatsApp OTP Service
async function sendWhatsAppOTP(phone, code) {
  try {
    // TODO: Integrate with WhatsApp Business API
    console.log(`📱 WhatsApp OTP sent to ${phone}: ${code}`);
    return { success: true };
  } catch (error) {
    console.error('WhatsApp OTP failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendWhatsAppOTP };