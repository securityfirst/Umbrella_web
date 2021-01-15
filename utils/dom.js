import * as Blob from "blob";

export const generateHTML = (marked = "") => {
  return `
		<!doctype html>
		<html>
			<head>
				<style>
					h1 {
						text-transform: capitalize;
					}
					a {
						color: #0366D6;
						text-decoration: none;
					}
					#content {
						max-width: 960px;
						margin: 2rem auto;
						padding: 1rem 2rem;
						font-size: 16px;
						-ms-text-size-adjust: 100%;
						-webkit-text-size-adjust: 100%;
						line-height: 1.5;
						color: #24292E;
						font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
						font-size: 16px;
						line-height: 1.5;
						word-wrap: break-word;
						background-color: white;
					}
					#title {
						margin-bottom: 0;
					}
					#subtitle {
						margin-top: 0;
						color: #5E5E5E;
						text-transform: capitalize;
					}
					#checklist ul {
						list-style: none;
						padding-inline-start: 0;
					}
				</style>
			</head>
			<body>
				<div id="content">
					${marked}
				</div>
			</body>
		</html>
	`;
};

export const downloadPdf = (name = "download", marked) => {
  if (typeof window === "undefined") return false;

  if (!name || !marked) {
    alert("Something went wrong. Please refresh the page and try again.");
    return false;
  }

  const date = new Date();
  const filename = `Umbrella_${name.trim()}_${date.getUTCFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}.pdf`;

  try {
    const html2pdf = require("html2pdf.js");

    let placeholder = document.createElement("div");
    placeholder.innerHTML = generateHTML(marked);
    document.body.appendChild(placeholder);

    const worker = html2pdf()
      .set({
        margin: 0.5,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, imageTimeout: 15000 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(placeholder)
      .save()
      .then(() => {
        placeholder.remove();
      });
  } catch (e) {
    console.error(`Failed to download ${filename}: `, e);
    throw e;
  }
};

export const downloadHtml = (name = "download", marked) => {
  if (typeof window === "undefined") return false;

  if (!marked) {
    alert("Something went wrong. Please refresh the page and try again.");
    return false;
  }

  const date = new Date();
  const filename = `Umbrella_${name.trim()}_${date.getUTCFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}.html`;

  try {
    const html = generateHTML(marked);
    const blob = new Blob([html], { type: "application/html" });
    const url = "data:text/html;charset=utf-8," + encodeURIComponent(html);

    save(blob, url, filename);
  } catch (e) {
    console.error(`Failed to download ${filename}: `, e);
    throw e;
  }
};

export const downloadDocx = async (name = "download", marked) => {
  if (typeof window === "undefined") return false;

  if (!marked) {
    alert("Something went wrong. Please refresh the page and try again.");
    return false;
  }

  const date = new Date();
  const filename = `Umbrella_${name.trim()}_${date.getUTCFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}.docx`;

  try {
    const html = `
			<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
				<head><meta charset='utf-8'><title>${name}</title></head>
				<body>${marked}</body>
			</html>
		`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url =
      "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

    save(blob, url, filename);
  } catch (e) {
    console.error(`Failed to download ${filename}: `, e);
    throw e;
  }
};

function save(blob, url, filename) {
  // Create download link element
  const downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = url;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }

  document.body.removeChild(downloadLink);
}
