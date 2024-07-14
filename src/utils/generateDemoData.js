const generateDemoData = (numRecords) => {
  const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Chris Lee', 'Paul Walker']
  const emails = [
    'john@example.com',
    'jane@example.com',
    'alice@example.com',
    'chris@example.com',
    'paul@example.com',
  ]
  const companies = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E']

  return Array.from({ length: numRecords }, (v, k) => ({
    id: k + 1,
    name: names[Math.floor(Math.random() * names.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    age: Math.floor(Math.random() * 60) + 18,
    address: `Address ${k + 1}`,
    phone: `123-456-789${k}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    country: `Country ${k + 1}`,
    city: `City ${k + 1}`,
    zip: `Zip ${k + 1}`,
  }))
}

export default generateDemoData
