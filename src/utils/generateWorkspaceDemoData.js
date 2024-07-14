const generateWorkspaceDemoData = (num) => {
  const workspaces = []

  for (let i = 1; i <= num; i++) {
    workspaces.push({
      id: i,
      name: `Workspace ${i}`,
      address: `Address ${i}`,
      description: `Description for workspace ${i}`,
      image: ``, // Placeholder for image file names
      opening_time: '08:00',
      closing_time: '20:00',
      dayoff: ['Sunday', 'Saturday'],
    })
  }

  return workspaces
}

export default generateWorkspaceDemoData
