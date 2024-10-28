async function hashString(inputString) {
  // Step 1: Encode the input string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);

  // Step 2: Compute the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Step 3: Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  // Output the hash
  console.log('SHA-256 Hash of the input string:', hashHex);
  
  return hashHex; // Return the computed hash
}

function downloadVariableAsFile(variable, fileName) {
  // Convert the variable to a JSON string (or another format if needed)
  const content = JSON.stringify(variable, null, 2); // Pretty-print with 2 spaces

  // Create a Blob from the content
  const blob = new Blob([content], { type: 'application/json' });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Programmatically click the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up and remove the link
  document.body.removeChild(link);
}

// Prepare Data
var data = [];
var cards = document.querySelectorAll("div[data-controller='app-card']"); // Use single quotes for attribute value
for (var i = 0; i < cards.length; i++) {
  var card = cards[i];
  var title = card.querySelector("div.tw-text-body-md");
  
  // Check if title is found
  if (title) {
      var title_str = title.innerText; // Get the inner text of the title
      var link = title.querySelector("a");
      
      // Check if link is found
      if (link) {
          var link_str = link.getAttribute("href"); // Get the href attribute of the link

          var review = card.querySelector("div.tw-items-center");
          
          // Ensure review is found before accessing innerText
          var review_point = 0.0;
          var review_number = 0;
          if (review) {
            // Parse the review point and review number correctly
            var review_text = review.innerText.replaceAll("Ad\n", "");
            try {
              review_point = parseFloat(review_text.split("\n")[0]); // Use parseFloat instead of float
              review_number = parseInt((review_text.split("\n")[2]).replaceAll("(", "").replaceAll(")", "").replaceAll(",", ""), 10); // Use parseInt instead of int
            } catch {}
          }

          data.push({ // Use push to add the object to the array
            name: title_str,
            link: link_str,
            review: review_point,
            review_number: review_number,
        });
      }
  }
}

// Call the function to hash the string and download the variable as a file
async function executeDownload() {
  const hash = await hashString(window.location.href); // Wait for the hash to be computed
  downloadVariableAsFile(data, `${hash}.json`); // Use the hash as the filename
}

// Execute the download
executeDownload();
