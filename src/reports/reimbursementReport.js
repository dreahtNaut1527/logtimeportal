import filesaver from 'file-saver'

function printExcel(data) {
    let strTableHeader = ''

    //Column heading
    strTableHeader = `<tr height=57 style='height:42.75pt; text-align:center;'>
        <td colspan=7 height=57 width=612 style='border: thin solid black; font-weight: bold; height:42.75pt; width:460pt'>WORK FROM HOME MEAL REIMBURSEMENT REQUEST</td>
        <td width=64 style='width:48pt'></td>
        <td width=64 style='width:48pt'></td>
        <td width=64 style='width:48pt'></td>
    </tr>
    <tr height=18 style='height:13.5pt; text-align:center;'>
        <td rowspan=2 height=36 style='height:27.0pt;font-weight: bold;border-top:none'>Employee No.</td>
        <td rowspan=2 style='border: thin solid black; font-weight: bold;'>Employee Name</td>
        <td rowspan=2 style='border: thin solid black; font-weight: bold;'>Division</td>
        <td colspan=2 style='border: thin solid black; font-weight: bold;'>Period Covered</td>
        <td rowspan=2 style='border: thin solid black; font-weight: bold;'>No. of days</td>
        <td rowspan=2 style='border: thin solid black; font-weight: bold;'>Amount</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=18 style='height:13.5pt; text-align:center;'>
        <td height=18  style='border: thin solid black; font-weight: bold;height:13.5pt;'>From</td>
        <td style='border: thin solid black; font-weight: bold;'>To</td>
        <td></td>
        <td></td>
        <td></td>
   </tr>`

    // Loop through, add tr tags to each row, add td tags to each cell
    data.forEach(rec => {
        strTableHeader +="<tr style='text-align:center;'>";
            Object.values(rec).forEach((item, index) => {
                strTableHeader +=`<td style="${index == 0 ? 'vnd.ms-excel.numberformat:00000;' : ''} border: thin solid black">${item + '\t'}</td>`;
            })
        strTableHeader +='</tr>';
    })

    // Footer
    strTableHeader += `<tr height=17 style='height:12.75pt'>
        <td height=17 style='height:12.75pt'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'>Prepared by:</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17 style='border-bottom: thin solid black; height:12.75pt'></td>
        <td style='border-bottom: thin solid black;'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  colspan=2 style='height:12.75pt'>${this.logtimeuserinfo.EmployeeName}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'>Approved by:</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17 style='border-bottom: thin solid black; height:12.75pt'></td>
        <td style='border-bottom: thin solid black;'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  colspan=2 style='height:12.75pt'>MR. KOUJI MORIKAGE</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17  style='height:12.75pt'></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr height=17 style='height:12.75pt'>
        <td height=17 class=xl7118996 colspan=6 style='height:12.75pt'>***Please
        submit on or before the payroll cut off. (5th and 20th of the month)</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
   <![if supportMisalignedColumns]>
    <tr height=0 style='display:none'>
        <td width=90 style='width:68pt'></td>
        <td width=102 style='width:77pt'></td>
        <td width=92 style='width:69pt'></td>
        <td width=68 style='width:51pt'></td>
        <td width=72 style='width:54pt'></td>
        <td width=87 style='width:65pt'></td>
        <td width=101 style='width:76pt'></td>
        <td width=64 style='width:48pt'></td>
        <td width=64 style='width:48pt'></td>
        <td width=64 style='width:48pt'></td>
    </tr>`

    //Worksheet name
    let worksheet = 'Employees'
    let uri = 'data:application/vnd.ms-excel;base64,';

    //Downloaded form template data
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${strTableHeader}</table></body></html>`;

    //Download template
    filesaver.saveAs(uri + base64(template), 'Meal Reimbursement.xls')
}

// output base64 encoding
function base64(s) { 
    return window.btoa(unescape(encodeURIComponent(s))) 
}

export default printExcel
