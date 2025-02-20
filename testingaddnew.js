





debugger;
const pageContent = document.getElementById('page-content');
if (pageContent) {
    pageContent.style.filter = 'blur(1px)';
}

const openDialog = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const dialog = document.createElement('div');
    dialog.style.width = '870px';
    dialog.style.padding = '27px';
    dialog.style.backgroundColor = '#fff';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    dialog.style.textAlign = 'left';

    const fieldsContainer = document.createElement('div');
    fieldsContainer.style.display = 'grid';
    fieldsContainer.style.gridTemplateColumns = '1fr 1fr';
    fieldsContainer.style.gap = '20px';

    const dataKeys = [
        'Customer Name',
        'Email Domain',
        'Inspection Date',
        'Expiry Date',
        'Acknowledgment Response Time (Min)',
        'Claim Processing SLA (Hours)',
        'Payment Settlement Timeframe (Days)',
        'Contract Document'
    ];

    dataKeys.forEach((label) => {
        const fieldset = document.createElement('fieldset');
        fieldset.style.border = '1px solid #255fa6';
        fieldset.style.borderRadius = '4px';
        fieldset.style.padding = '10px';
        fieldset.style.display = 'flex';
        fieldset.style.flexDirection = 'column';

        const legend = document.createElement('legend');
        legend.textContent = label;
        fieldset.appendChild(legend);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = label;
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.width = '100%';

        if (label === 'Contract Document') {
            // Create the file upload component
            const fileUploadWrapper = document.createElement('div');
            fileUploadWrapper.style.position = 'relative';

            // File input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.padding = '5px';
            fileInput.style.border = '1px solid #ccc';
            fileInput.style.borderRadius = '4px';
            fileInput.style.width = '100%';
            fileInput.id = label;
            // Table for file components
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '10px';
            table.style.display = 'none';  // Initially hide the table

            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headerSrNo = document.createElement('th');
            headerSrNo.textContent = 'Sr. No.';
            const headerFile = document.createElement('th');
            headerFile.textContent = 'File Name';
            const headerAction = document.createElement('th');
            headerAction.textContent = 'Action';
            const headerDownload = document.createElement('th');
            headerDownload.textContent = 'Download';
            headerRow.appendChild(headerSrNo);
            headerRow.appendChild(headerFile);
            headerRow.appendChild(headerAction);
            headerRow.appendChild(headerDownload);
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');
            table.appendChild(tableBody);

            fileUploadWrapper.appendChild(fileInput);
            fieldset.appendChild(fileUploadWrapper);

            // Handle file upload and table row creation
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Hide the file input and show the table
                    fileInput.style.display = 'none';
                    table.style.display = 'table';




                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        const base64String = reader.result.split(",")[1]; // Extract Base64 content
                        console.log("Base64 String:", base64String);  // Log the base64 string to confirm

                        // Get the file name and extension
                        const fileName = file.name;
                        const fileExtension = fileName.split('.').pop();

                        console.log("File Name:", fileName);         // Log file name
                        console.log("File Extension:", fileExtension); // Log file extension

                        // Make the API call
                        sendToMp3API(base64String, fileName, fileExtension);
                    };
                    reader.onerror = function (error) {
                        console.error("Error reading file:", error);
                    };



                    function sendToMp3API(base64Audio, fileName, fileExtension) {
                        // Get user and organization ID dynamically
                        const userId = new PlatformContext('form_Wqphccs').getUser().getId();
                        const orgId = new PlatformContext('form_Wqphccs').getOrganization().getId();

                        // Log the IDs to check if they are correct
                        console.log("User ID:", userId);
                        console.log("Organization ID:", orgId);

                        // Ensure the IDs are valid (not 0 or undefined)
                        if (!userId || !orgId) {
                            console.error("Invalid User ID or Organization ID");
                            return;
                        }

                        fetch("https://platform.evoluteiq.net/platform/voice-service/toMp3", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "access_token": "ec586b65-6352-4369-986c-656097af39e9"
                            },
                            body: JSON.stringify({
                                base64String: base64Audio,
                                fileExtension: fileExtension, // Include the file extension dynamically
                                fileName: fileName,           // Include the file name dynamically
                                organizationId: orgId,       // Include organization_id
                                userId: userId               // Include user_id
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    console.log("File uploaded successfully:", data);
                                    const dmsPath = data.data.dmsPath; // Extract DMS Path
                                    const responseFileName = fileName; // Keep original file name

                                    // Log the dmsPath for verification 
                                    console.log("DMS Path:", dmsPath);

                                    // Find the text box with the ID "platform_id_DdKdgQTh" and set its value to the dmsPath
                                    const platformIdTextbox = document.getElementById("platform_id_DdKdgQTh");
                                    if (platformIdTextbox) {
                                        platformIdTextbox.value = dmsPath; // Bind the dmsPath to the text box
                                    } if (dmsPath) {
                                        // Store response values in the global scope
                                        window.latestDmsPath = dmsPath;
                                        window.latestFileName = responseFileName;

                                        // Trigger click event for download
                                        //downloadIcon.click();
                                    } else {
                                        console.error("Text box with ID 'platform_id_DdKdgQTh' not found.");
                                    }
                                } else {
                                    console.error("Upload failed:", data.errors || data);
                                }
                            })
                            .catch(error => {
                                console.error("API Call Error:", error);
                                if (error.response) {
                                    console.log("Error Response:", error.response.data);
                                }
                            });
                    }
                    const row = document.createElement('tr');
                    const srNoCell = document.createElement('td');
                    srNoCell.textContent = tableBody.children.length + 1; // Dynamically create Sr. No.
                    const fileCell = document.createElement('td');
                    fileCell.textContent = file.name; // Display file name
                    const actionCell = document.createElement('td');
                    const downloadCell = document.createElement('td');
                    const downloadIcon = document.createElement('span');
                    downloadIcon.style.cursor = 'pointer';
                    downloadIcon.style.color = '#059862'; // Blue color for the download icon
                    downloadIcon.style.fontSize = '18px'; // Adjust the font size for better visibility
                    //downloadIcon.style.marginLeft = '26px';
                    downloadIcon.style.display = 'flex';
                    downloadIcon.style.alignItems = 'center';
                    downloadIcon.style.justifyContent = 'center';
                    // SVG for the download icon
                    downloadIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="currentColor">
        <path d="M288 352V224H160V352H32L224 528L416 352H288zM448 0H0C0 17.67 14.33 32 32 32H416C433.7 32 448 17.67 448 0C448 -17.67 433.7 -32 416 -32H32C14.33 -32 0 -17.67 0 0H448z"/>
    </svg>
`;
                    /*
                      // Create delete action (trash icon)
                      const deleteIcon = document.createElement('svg');
                      deleteIcon.className = 'svg-inline--fa fa-trash';
                      deleteIcon.style.cursor = 'pointer';
                      deleteIcon.style.color = 'rgb(231, 76, 60)'; // Red color for trash icon
                      deleteIcon.setAttribute('aria-hidden', 'true');
                      deleteIcon.setAttribute('focusable', 'false');
                      deleteIcon.setAttribute('data-prefix', 'fas');
                      deleteIcon.setAttribute('data-icon', 'trash');
                      deleteIcon.setAttribute('role', 'img');
                      deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                      deleteIcon.setAttribute('viewBox', '0 0 448 512');
  
                      const deletePath = document.createElement('path');
                      deletePath.setAttribute('fill', 'currentColor');
                      deletePath.setAttribute('d', 'M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z');
                      deleteIcon.appendChild(deletePath);
  
                      deleteIcon.addEventListener('click', () => {
                          // Delete the row
                          tableBody.removeChild(row);
  
                          // If no rows are left, show the "Choose File" input again
                          if (tableBody.children.length === 0) {
                              fileInput.style.display = 'block';
                              table.style.display = 'none';
                          }
                      });
  
                      actionCell.appendChild(deleteIcon); */

                    const deleteIcon = document.createElement('span');
                    deleteIcon.style.cursor = 'pointer';
                    deleteIcon.style.color = 'rgb(231, 76, 60)'; // Red color for trash icon
                    deleteIcon.style.fontSize = '16px'; // Adjust icon size
                    deleteIcon.style.display = 'flex';
                    deleteIcon.style.alignItems = 'center';
                    deleteIcon.style.justifyContent = 'center';
                    deleteIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
        <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"></path>
    </svg>
`;

                    // Add a click event to handle row deletion
                    deleteIcon.addEventListener('click', () => {
                        tableBody.removeChild(row);

                        // If no rows are left, show the file input and hide the table
                        if (tableBody.children.length === 0) {
                            fileInput.style.display = 'block';
                            table.style.display = 'none';
                        }
                    });

                    downloadIcon.addEventListener('click', () => {
                        event.preventDefault();

                        const dmsPath = window.latestDmsPath;
                        const fileName = window.latestFileName || "downloaded_file.xlsx";
                        // Get dmsPath from the specific element
                        // const dmsPathElement = document.getElementById("platform_id_DdKdgQTh");
                        // const dmsPath = dmsPathElement ? dmsPathElement.value : null;

                        // // Get fileName from the specific element
                        // const fileInputElement = document.getElementById("platform_id_Lld6Vs5u");
                        // const fileName = fileInputElement ? fileInputElement.value : 'downloaded_file.xlsx';

                        if (!dmsPath || !fileName) {
                            console.error('Missing dmsPath or fileName.');
                            return;
                        }

                        // Generate p_token
                        const token = new PlatformContext('').getPage().getToken();
                        const secret = new PlatformContext('').getPage().getSecretKey();
                        const ptoken = CryptoJS.AES.encrypt(token, atob(secret)).toString();

                        // Construct the download URL dynamically
                        const url = `/platform/workflow-service/download-document-by-url?dmsPath=${encodeURIComponent(dmsPath)}&orgId=66709&fileName=${encodeURIComponent(fileName)}&p_token=${ptoken}`;

                        // Create an AJAX request
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);

                        // Setting headers
                        xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
                        xhr.setRequestHeader('Accept-Language', 'en-GB,en-US;q=0.9,en;q=0.8');
                        xhr.setRequestHeader('Cache-Control', 'no-cache');

                        // Set response type to blob (since it's a file)
                        xhr.responseType = 'blob';

                        // Handle the response
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                const blob = xhr.response;
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = fileName; // Map dynamically fetched file name
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            } else {
                                console.error('Failed to download file', xhr.status, xhr.statusText);
                            }
                        };

                        xhr.onerror = function () {
                            console.error('Network error occurred');
                        };

                        // Send the request
                        xhr.send();
                    });

                    downloadCell.appendChild(downloadIcon);
                    // Append the icon to the action cell
                    actionCell.appendChild(deleteIcon);
                    row.appendChild(srNoCell);
                    row.appendChild(fileCell);
                    row.appendChild(actionCell);
                    row.appendChild(downloadCell);
                    tableBody.appendChild(row);
                }
            });

            fieldset.appendChild(table);
        } else if (label === 'Inspection Date' || label === 'Expiry Date') {
            input.className = 'datepicker';

            // Create <i> for calendar icon
            const calendarIcon = document.createElement('i');
            calendarIcon.className = 'fa-solid fa-calendar-days';
            calendarIcon.style.position = 'absolute';
            calendarIcon.style.right = '10px';
            calendarIcon.style.top = '50%';
            calendarIcon.style.transform = 'translateY(-50%)';
            calendarIcon.style.cursor = 'pointer';
            calendarIcon.style.color = '#104766';
            calendarIcon.style.fontSize = '18px'; // Adjust the size if necessary

            // Add click event to open calendar
            calendarIcon.addEventListener('click', () => {
                input._flatpickr.open(); // Opens the Flatpickr calendar
            });

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.appendChild(input);
            wrapper.appendChild(calendarIcon);

            fieldset.appendChild(wrapper);
        } else {
            fieldset.appendChild(input);
        }

        fieldsContainer.appendChild(fieldset);
    });

    dialog.appendChild(fieldsContainer);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.marginTop = '20px';
    saveButton.style.padding = '10px 20px';
    saveButton.style.backgroundColor = '#104766';
    saveButton.style.color = '#fff';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';

    debugger;
    saveButton.addEventListener('click', () => {
        new PlatformContext('form_Wqphccs').getPreloader().show();

        var CustomerID = document.getElementById('platform_id_GsXneIfn').value;
        var customerName = document.getElementById("Customer Name").value;
        var emailDomain = document.getElementById("Email Domain").value;
        var inspectionDate = document.getElementById("Inspection Date").value;
        var expiryDate = document.getElementById("Expiry Date").value;
        //var acknowledgmentResponseTime = document.getElementById("Acknowledgment Response Time (Min)").value;
        var acknowledgmentResponseTime = parseInt(document.getElementById("Acknowledgment Response Time (Min)").value.match(/\d+/), 10);
        var claimProcessingSLA = parseInt(document.getElementById("Claim Processing SLA (Hours)").value.match(/\d+/), 10);
        var paymentSettlementTimeframe = parseInt(document.getElementById("Payment Settlement Timeframe (Days)").value.match(/\d+/), 10);
        //var claimProcessingSLA = document.getElementById("Claim Processing SLA (Hours)").value;
        //var paymentSettlementTimeframe = document.getElementById("Payment Settlement Timeframe (Days)").value;
        var filePath = document.getElementById("platform_id_DdKdgQTh").value;
        var contractDocument = document.getElementById('Contract Document').value.split('\\')[document.getElementById('Contract Document').value.split('\\').length - 1]
        //var contractDocument = document.getElementById("Contract Document").value;

        // Execute database script
        new PlatformContext('form_Wqphccs').getServices().getDatabaseScript().execute({
            applicationName: "LookupCalls",
            async: false,
            variables: [
                { name: "CustomerID", value: CustomerID }, // Replace with actual CustomerID if needed
                { name: "CustomerName", value: customerName },
                { name: "Email", value: emailDomain },
                { name: "InspectionDate", value: inspectionDate },
                { name: "ExpiryDate", value: expiryDate },
                { name: "AcknowledgmentDeadline", value: acknowledgmentResponseTime },
                { name: "ClaimApprovalDeadline", value: claimProcessingSLA },
                { name: "PaymentDeadline", value: paymentSettlementTimeframe },
                { name: "FileName", value: contractDocument },
                { name: "FilePath", value: filePath }, // You can adjust file path if required
                { name: "LoggedUserID", value: new PlatformContext('form_Wqphccs').getUser().getId() }
            ],
            databaseScriptName: "UpsertCustomerMaster",
            processflowName: "TestProcess",
            onSuccess: function (response) {
                if (response.success) {
                    setTimeout(function () {
                        // Show success modal
                        new PlatformContext('form_Wqphccs').getModal().success(
                            "Data Saved Successfully."
                        );
                        new PlatformContext('form_Wqphccs').getPreloader().hide();
                        // Remove overlay and reset filter after saving
                        document.body.removeChild(overlay); // Assuming 'overlay' is defined elsewhere
                        pageContent.style.filter = ''; // Assuming 'pageContent' is defined elsewhere
                    }, 100);
                } else {
                    new PlatformContext('form_Wqphccs').getModal().error(
                        "Error saving data."
                    );
                }
            },
            onError: function (error) {
                // Handle error
                new PlatformContext('form_Wqphccs').getModal().error(
                    "An error occurred: " + error.message
                );
            }
        });
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#104766';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        pageContent.style.filter = '';
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.lineHeight = '1.1';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(closeButton);
    dialog.appendChild(buttonContainer);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    document.querySelectorAll('.datepicker').forEach((datepicker) => {
        flatpickr(datepicker, {
            dateFormat: 'Y-m-d',
            allowInput: true,
        });
    });
};

openDialog();





/*
const pageContent = document.getElementById('page-content');
    if (pageContent) {
        pageContent.style.filter = 'blur(1px)';
    }

    const openDialog = () => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        const dialog = document.createElement('div');
        dialog.style.width = '800px';
        dialog.style.padding = '27px';
        dialog.style.backgroundColor = '#fff';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dialog.style.textAlign = 'left';

        const fieldsContainer = document.createElement('div');
        fieldsContainer.style.display = 'grid';
        fieldsContainer.style.gridTemplateColumns = '1fr 1fr';
        fieldsContainer.style.gap = '20px';

        const dataKeys = [
            'Customer Name', 
            'Email Domain', 
            'Inspection Date', 
            'Expiry Date', 
            'Acknowledgment Response Time (Min)', 
            'Claim Processing SLA (Hours)', 
            'Payment Settlement Timeframe (Days)', 
            'Contract Document'
        ];

        dataKeys.forEach((label) => {
            const fieldset = document.createElement('fieldset');
            fieldset.style.border = '1px solid #255fa6';
            fieldset.style.borderRadius = '4px';
            fieldset.style.padding = '10px';
            fieldset.style.display = 'flex';
            fieldset.style.flexDirection = 'column';

            const legend = document.createElement('legend');
            legend.textContent = label;
            fieldset.appendChild(legend);

            const input = document.createElement('input');
            input.type = 'text';
            input.style.padding = '5px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';
            input.style.width = '100%';

            if (label === 'Contract Document') {
                // Create the file upload component
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.style.padding = '5px';
                fileInput.style.border = '1px solid #ccc';
                fileInput.style.borderRadius = '4px';
                fileInput.style.width = '100%';

                const fileUploadWrapper = document.createElement('div');
                fileUploadWrapper.style.position = 'relative';
                fileUploadWrapper.appendChild(fileInput);

                // Optional: Display the file name once uploaded
                const fileNameDisplay = document.createElement('span');
                fileNameDisplay.style.position = 'absolute';
                fileNameDisplay.style.right = '10px';
                fileNameDisplay.style.top = '50%';
                fileNameDisplay.style.transform = 'translateY(-50%)';
                fileNameDisplay.style.color = '#104766';
                fileNameDisplay.style.fontSize = '12px';
                fileNameDisplay.style.fontStyle = 'italic';
                fileUploadWrapper.appendChild(fileNameDisplay);

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        fileNameDisplay.textContent = file.name; // Show the file name
                    }
                });

                fieldset.appendChild(fileUploadWrapper);
            } else if (label === 'Inspection Date' || label === 'Expiry Date') {
                const calendarIcon = document.createElement('i');
                calendarIcon.className = 'fa-solid fa-calendar-days';
                calendarIcon.style.position = 'absolute';
                calendarIcon.style.right = '10px';
                calendarIcon.style.top = '50%';
                calendarIcon.style.transform = 'translateY(-50%)';
                calendarIcon.style.cursor = 'pointer';
                calendarIcon.style.color = '#104766';

                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.appendChild(input);
                wrapper.appendChild(calendarIcon);

                fieldset.appendChild(wrapper);
            } else {
                fieldset.appendChild(input);
            }

            fieldsContainer.appendChild(fieldset);
        });

        dialog.appendChild(fieldsContainer);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.marginTop = '20px';
        saveButton.style.padding = '10px 20px';
        saveButton.style.backgroundColor = '#104766'; 
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';

        saveButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            pageContent.style.filter = '';
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#104766';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            pageContent.style.filter = '';
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.lineHeight = '1.1';

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(closeButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    };

    openDialog();











/*
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        pageContent.style.filter = 'blur(1px)';
    }

    const openDialog = () => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        const dialog = document.createElement('div');
        dialog.style.width = '800px';
        dialog.style.padding = '27px';
        dialog.style.backgroundColor = '#fff';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dialog.style.textAlign = 'left';

        const fieldsContainer = document.createElement('div');
        fieldsContainer.style.display = 'grid';
        fieldsContainer.style.gridTemplateColumns = '1fr 1fr';
        fieldsContainer.style.gap = '20px';

        const dataKeys = [
            'Customer Name', 
            'Email Domain', 
            'Inspection Date', 
            'Expiry Date', 
            'Acknowledgment Response Time (Min)', 
            'Claim Processing SLA (Hours)', 
            'Payment Settlement Timeframe (Days)', 
            'Contract Document'
        ];

        dataKeys.forEach((label) => {
            const fieldset = document.createElement('fieldset');
            fieldset.style.border = '1px solid #255fa6';
            fieldset.style.borderRadius = '4px';
            fieldset.style.padding = '10px';
            fieldset.style.display = 'flex';
            fieldset.style.flexDirection = 'column';

            const legend = document.createElement('legend');
            legend.textContent = label;
            fieldset.appendChild(legend);

            const input = document.createElement('input');
            input.type = 'text';
            input.style.padding = '5px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';
            input.style.width = '100%';

            if (label === 'Contract Document') {
                input.style.backgroundColor = '#e9ecef';
                input.style.cursor = 'not-allowed';

                const editIcon = document.createElement('i');
                editIcon.className = 'fa-solid fa-pen-to-square';
                editIcon.style.position = 'absolute';
                editIcon.style.right = '10px';
                editIcon.style.top = '50%';
                editIcon.style.transform = 'translateY(-50%)';
                editIcon.style.cursor = 'pointer';
                editIcon.style.color = '#104766';

                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.appendChild(input);
                wrapper.appendChild(editIcon);
                fieldset.appendChild(wrapper);
            } else if (label === 'Inspection Date' || label === 'Expiry Date') {
                const calendarIcon = document.createElement('i');
                calendarIcon.className = 'fa-solid fa-calendar-days';
                calendarIcon.style.position = 'absolute';
                calendarIcon.style.right = '10px';
                calendarIcon.style.top = '50%';
                calendarIcon.style.transform = 'translateY(-50%)';
                calendarIcon.style.cursor = 'pointer';
                calendarIcon.style.color = '#104766';

                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.appendChild(input);
                wrapper.appendChild(calendarIcon);

                fieldset.appendChild(wrapper);
            } else {
                fieldset.appendChild(input);
            }

            fieldsContainer.appendChild(fieldset);
        });

        dialog.appendChild(fieldsContainer);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.marginTop = '20px';
        saveButton.style.padding = '10px 20px';
        saveButton.style.backgroundColor = '#104766'; 
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';

        saveButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            pageContent.style.filter = '';
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#104766';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            pageContent.style.filter = '';
        });

    
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'flex-end';
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.gap = '10px';
           buttonContainer.style.lineHeight = '1.1';

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(closeButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    };

    openDialog();



/*var modal = document.getElementById('myModal');
var openButton = document.getElementById('platform_id_tcQiRI5V-2');

// Clear the fields
document.getElementById('platform_id_ndkhKyU').value = '';
document.getElementById('platform_id_ndkhKyU-2').value = '';
document.getElementById('platform_id_2xnJXMqC-3').value = '';
document.getElementById('platform_id_2xnJXMqC-4').value = '';
document.getElementById('platform_id_2xnJXMqC-5').value = '';
document.getElementById('platform_id_2xnJXMqC-6').value = '';
document.getElementById('platform_id_2xnJXMqC-7').value = '';
document.getElementById('platform_id_cOD543xX').value = '';

// Show the modal
modal.style.display = 'block';
*/
