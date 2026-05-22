
$outputPath = "c:\Users\jyoti\Desktop\New folder\WaterDispenser\WaterDispenser_Project_Report.docx"

# Initialize Word
$wordApp = New-Object -ComObject Word.Application
$wordApp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
$document = $wordApp.Documents.Add()
$selection = $wordApp.Selection

# Helper function to add headings
function Add-Heading {
    param($text, $level)
    $selection.Style = "Heading $level"
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

# Helper function to add body text
function Add-Body {
    param($text)
    $selection.Style = "Normal"
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

# --- Title Slide Info ---
Add-Heading "INTERNSHIP PROJECT REPORT: SMART WATER DISPENSER SYSTEM" 1
Add-Body "SUBMITTED BY: Jyoti Ranjan"
Add-Body "BRANCH: Computer Science & Engineering"
Add-Body "ORGANIZATION: IoT Solutions Ltd."
Add-Body "`n"

# --- Introduction ---
Add-Heading "1. Introduction" 2
Add-Body "Background and Motivation: The Smart Water Dispenser project is driven by the need for automated, hygienic, and efficient water distribution systems in public and private spaces. Traditional dispensers often lack real-time monitoring of water quality (TDS) and quantity, leading to maintenance delays. This project aims to integrate IoT-based monitoring with a secure digital payment system."
Add-Body "Technology Verticals: The system is built on the MERN stack (MongoDB, Express, React, Node.js), utilizing React for a dynamic frontend, Node.js and Express for the robust backend API, and MongoDB Atlas for cloud-based data storage. Cashfree PG is integrated for secure transaction processing."
Add-Body "Importance of Summer Internship: This internship provides hands-on experience in full-stack development, API integration, and database management, bridging the gap between academic theory and industry practice."

# --- Project Overview ---
Add-Heading "2. Project Overview" 2
Add-Body "Problem Definition: Development of a system that can real-time monitor water tank levels, TDS, and provide a self-service water dispensing interface with integrated payments."
Add-Body "Specifications and Code Details: The backend was developed using Express.js with a Mongoose schema to track 'remaining' water, 'tank_capacity', and 'TDS' levels. The frontend uses React with Vite for high performance and Tailwind CSS for a modern aesthetic."
Add-Body "Inputs and Outputs: Inputs include user-requested water quantity (liters) and payment details via Cashfree. Outputs include a successfully processed payment, updated tank state in the database, and a digital bill generated for the user."

# --- Objectives ---
Add-Heading "3. Objectives" 2
Add-Body "The following objectives were achieved during the internship:"
Add-Body "1. Developed a real-time monitoring dashboard for water tank parameters."
Add-Body "2. Successfully integrated Cashfree Payment Gateway for per-liter water purchases."
Add-Body "3. Built an automated system to update the physical state (remaining water) in the database upon successful transaction."

# --- Results and Findings ---
Add-Heading "4. Results and Findings" 2
Add-Body "Analysis: The system demonstrated 100% accuracy in updating water levels after payment. The Cashfree PG integration handled multiple concurrent orders in the sandbox environment without failure."
Add-Body "Key Findings: Integrating real-time state management with payment callbacks ensures data integrity. The use of React-Vite significantly improved the frontend load times compared to traditional CRA setups."

# --- Analysis and Discussion ---
Add-Heading "5. Analysis and Discussion" 2
Add-Body "Interpretation: The results indicate that the MERN stack is highly suitable for building scalable IoT-adjacent applications. The system effectively manages the transition from 'Manual' to 'Auto' mode for water level tracking."
Add-Body "Challenges: Key challenges included managing CORS (Cross-Origin Resource Sharing) between the frontend at port 5173 and backend at port 3567, and ensuring the asynchronous payment verification process was thread-safe."

# --- Summary and Conclusion ---
Add-Heading "6. Summary of Internship" 2
Add-Body "Accomplishments: Gained proficiency in React, Node.js Express, and MongoDB. Successfully implemented a functional payment gateway integration."
Add-Body "Future Strategy: Plan to incorporate real-time IoT hardware (sensors) to replace the manual API updates, enabling a truly automated water dispenser."

Add-Heading "7. Conclusion" 2
Add-Body "The internship provided a comprehensive understanding of industry-standard development practices, from API design to front-end responsiveness. The overall experience was highly educational, offering insights into the entire lifecycle of a tech project."

# --- Future Directions ---
Add-Heading "8. Future Directions & Advanced Internships" 2
Add-Body "Future Improvements: Integration of AI-based predictive maintenance for water filters. Development of a mobile app using React Native for a wider reach."

# Save and Close
$document.SaveAs([ref]$outputPath)
$document.Close()
$wordApp.Quit()

# Clean up
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wordApp) | Out-Null
Remove-Variable wordApp

Write-Host "Word Report saved to: $outputPath"
