import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateTeamOrderPDF = (teams) => {
  const doc = new jsPDF();

  teams.forEach((team, index) => {
    if (index > 0) doc.addPage();

    doc.setFontSize(16);
    doc.text("ELECTION DUTY APPOINTMENT ORDER", 105, 15, null, null, "center");
    
    doc.setFontSize(12);
    doc.text(`Team ID: ${team.id}`, 14, 30);
    doc.text(`Polling Station: ${team.stationId}`, 14, 38);
    
    doc.text("The following staff members are hereby appointed for election duty:", 14, 50);

    const tableColumn = ["Role", "Name", "Designation", "Office", "Mobile"];
    const tableRows = team.members.map((member, i) => [
       i === 0 ? "Presiding Officer" : `Polling Officer ${i}`,
       member.name,
       member.designation,
       member.office,
       member.mobile
    ]);

    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.text("By Order,", 160, doc.lastAutoTable.finalY + 30, null, null, "center");
    doc.text("District Election Officer", 160, doc.lastAutoTable.finalY + 40, null, null, "center");
    
    doc.setFontSize(10);
    doc.text("Note: Failure to report will invite disciplinary action.", 14, 280);
  });

  doc.save("Team_Formation_Orders.pdf");
};

export const generateOfficeOrderPDF = (officeName, employees) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("OFFICE-WISE ELECTION DUTY LIST", 105, 15, null, null, "center");
  doc.setFontSize(12);
  doc.text(`Office Name: ${officeName}`, 14, 25);
  
  const tableColumn = ["Code", "Name", "Designation", "Mobile"];
  const tableRows = employees.map(emp => [
      emp.code,
      emp.name,
      emp.designation,
      emp.mobile
  ]);

  doc.autoTable({
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
  });

  doc.save(`${officeName}_Election_Duty_List.pdf`);
};
