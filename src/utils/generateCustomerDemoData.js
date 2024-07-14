const generateCustomerDemoData = (num) => {
  const customers = []

  for (let i = 1; i <= num; i++) {
    customers.push({
      id: i,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `123-456-789${i % 10}`,
      address: `Address ${i}`,
      company: `Company ${i}`,
    })
  }

  return customers
}

export default generateCustomerDemoData
