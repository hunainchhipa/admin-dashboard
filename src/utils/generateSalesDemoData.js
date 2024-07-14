const generateDemoData = (num) => {
  const states = ['Pending', 'Completed', 'Canceled']
  const sales = []

  for (let i = 1; i <= num; i++) {
    const orderLines = [
      {
        product: `Product ${i}`,
        quantity: i,
        unitPrice: (i * 10).toFixed(2),
        tax: 5,
        total: (i * 10 * 1.05).toFixed(2),
      },
      {
        product: `Product ${i + 1}`,
        quantity: i + 1,
        unitPrice: ((i + 1) * 10).toFixed(2),
        tax: 10,
        total: ((i + 1) * 10 * 1.1).toFixed(2),
      },
    ]
    sales.push({
      id: i,
      customerName: `Customer ${i}`,
      so_id: `SO${String(i).padStart(3, '0')}`,
      date: `2024-07-12`,
      state: states[i % states.length],
      total: orderLines.reduce((acc, line) => acc + parseFloat(line.total), 0).toFixed(2),
      orderLines,
    })
  }

  return sales
}

export default generateDemoData
