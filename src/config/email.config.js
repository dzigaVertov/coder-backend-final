const PROD_EMAIL_CONFIG = {
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}

const TEST_EMAIL_CONFIG = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'kathlyn13@ethereal.email',
    pass: 'ksKXmN5C76WzK4Bejk'
  }
}

export let EMAIL_CONFIG = TEST_EMAIL_CONFIG;
