const rect = target.getBoundingClientRect();
    const gap = 5;  // Optional small offset for better positioning

    const table = target.closest('table');
    if (!table) return;

    // Find the correct table container using the unique ID
    const tableContainer = table.closest('.table-content-container');
    if (!tableContainer) return;

    // Set a fixed base left position for the first table
    const tableId = tableContainer.id; // Get unique table container ID
    const baseLeftPosition = document.querySelector('#dynamicTable').offsetWidth;

    const tables = document.querySelectorAll('table');
    // Find all tables and calculate left position based on the clicked table
    let leftPosition = baseLeftPosition + 90;

    // Calculate the left position based on the clicked table's order
    //const tables = document.querySelectorAll('table');
    //let tableIndex = Array.from(tables).indexOf(target.closest('table'));
    let tableIndex = Array.from(document.querySelectorAll('.table-content-container')).indexOf(tableContainer);
    // Adjust position: each subsequent table adds 80px to the left position
    if (tableIndex >= 0) {
        leftPosition += 80 * tableIndex;  // Each subsequent table adds 80px to the left
    }

    const topPosition = 347;
    // Set the popup position and override with !important
    popup.style.position = "absolute";
    popup.style.setProperty('top', `${topPosition}px`, 'important');
    popup.style.setProperty('left', `${leftPosition}px`, 'important');








