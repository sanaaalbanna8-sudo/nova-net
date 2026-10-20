const TOKEN = 'NOVA-NET-2026'

const CASES = [
  [1, 'مكاتب الأكاديمية والطابعة', 'أي شبكة أنسب لمكاتب الأكاديمية؟', 'B', 'WAN الواسعة', 'LAN المحلية', 'PAN الشخصية', 'المبنى واحد والمؤسسة تملكه. LAN سريعة لأن المسافة قصيرة.'],
  [2, 'هاتف الزائرة في الاستقبال', 'أي شبكة أنسب لهاتف الزائرة؟', 'C', 'SAN التخزين', 'PAN الشخصية', 'WLAN اللاسلكية', 'الهاتف يتحرك، فالموجة هي وسيلته، وشبكة الزوار تنفصل عن كيبل الموظفات.'],
  [3, 'فرع إربد ونظام عمّان', 'أي شبكة تربط إربد بعمّان؟', 'C', 'LAN المحلية', 'PAN الشخصية', 'WAN الواسعة', 'المسافة بين مدينتين والمسار يخرج من المبنى.'],
  [4, 'أرشيف ملفات الطالبات', 'أي شبكة أنسب لأرشيف الملفات؟', 'A', 'SAN التخزين', 'WLAN اللاسلكية', 'PAN الشخصية', 'SAN مسار خاص للبيانات الضخمة حتى لا تمشي الملفات على طريق أي جهاز.'],
  [5, 'سماعة المختبر', 'أي شبكة أنسب للسماعة؟', 'A', 'PAN الشخصية', 'WAN الواسعة', 'SAN التخزين', 'بلوتوث، مدى قصير، وطرفان متقاربين.'],
  [6, 'ملف من مجمع تجاري', 'أي شبكة أنسب لإرسال الملف؟', 'B', 'WLAN المجمع', 'WAN مسار الأكاديمية', 'PAN مع جهاز الغريب', 'صورة البطاقة ما تمشي على موجة مفتوحة.'],
  [7, 'مستودع المختبر', 'أي شبكة تغطي المستودع؟', 'C', 'SAN التخزين', 'PAN الشخصية', 'WLAN المتشابكة', 'الموجة تغطي مساحة أوسع من نقطة واحدة.'],
  [8, 'النسخ بين خوادم الغرفة', 'أي شبكة أنسب لهالنسخ؟', 'C', 'WLAN اللاسلكية', 'LAN لكل الأجهزة', 'SAN التخزين', 'الخادم يصل إلى القرص، وجهاز الاستقبال لا يصل.'],
  [9, 'ساعة المعلمة', 'أي شبكة أنسب للساعة؟', 'B', 'WAN الواسعة', 'PAN الشخصية', 'SAN التخزين', 'الساعة والهاتف متقاربان، والمدى حول الشخص.'],
  [10, 'طابقان في المبنى نفسه', 'أي شبكة تربط الطابقين؟', 'A', 'LAN المحلية', 'WAN الواسعة', 'PAN الشخصية', 'طابقان في مبنى واحد والسلك ما يطلع من السور.'],
  [11, 'الأجهزة اللوحية في الصف', 'أي شبكة أنسب للأجهزة اللوحية؟', 'C', 'SAN التخزين', 'PAN الشخصية', 'WLAN اللاسلكية', 'الجهاز يتحرك جوا الصف، فالكيبل ما يلحقه.'],
  [12, 'أسئلة الامتحان والأقراص', 'أي شبكة أنسب لملفات الامتحان؟', 'B', 'WLAN اللاسلكية', 'SAN التخزين', 'LAN لكل الصفوف', 'الامتحان يمشي بين الخادم والقرص فقط.'],
  [13, 'بيت المعلمة والنظام', 'أي شبكة تربط البيت بالأكاديمية؟', 'C', 'LAN البيت', 'PAN الشخصية', 'WAN الواسعة', 'البيت والمبنى مكانان، والمسار يخرج منهما.'],
  [14, 'ملف بين لابتوبين متلاصقين', 'أي شبكة أنسب لهالنقل؟', 'A', 'PAN الشخصية', 'WAN الواسعة', 'SAN التخزين', 'ملف صغير بين جهازين متلاصقين، وبعد النقل يُقفل الاكتشاف.'],
  [15, 'أجهزة المختبر الثابتة', 'أي شبكة أنسب لأجهزة المختبر؟', 'B', 'WLAN اللاسلكية', 'LAN المحلية', 'WAN الواسعة', 'الأجهزة ثابتة والكيبل موجود. الموجة بلا داعي.'],
]

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('نوفا')
    .addItem('مسح التجربة والبدء من جديد', 'clearTrial')
    .addToUi()
}

function onEdit(e) {
  try {
    if (!e || !e.range) return
    const sheet = e.range.getSheet()
    if (sheet.getName() !== 'لوحة المعلومات') return
    if (e.range.getA1Notation() !== 'B16') return
    if (e.range.getValue() !== true) return
    e.range.setValue(false)
    const ui = SpreadsheetApp.getUi()
    const answer = ui.alert(
      'مسح التجربة',
      'يمسح أصوات التجربة. الحالات والرسوم تبقى. أغلقي لوحة التحكم أولاً، وإلا ترجع التجربة مع أول تصويت. نعم؟',
      ui.ButtonSet.YES_NO
    )
    if (answer !== ui.Button.YES) return
    clearSheets_()
    ui.alert('تم المسح. اللوحة فاضية. افتحي لوحة التحكم من جديد وابدئي.')
  } catch (err) {}
}

function clearTrial() {
  const ui = SpreadsheetApp.getUi()
  const answer = ui.alert(
    'مسح التجربة',
    'يمسح أصوات التجربة. الحالات والرسوم تبقى. أغلقي لوحة التحكم أولاً، وإلا ترجع التجربة مع أول تصويت. نعم؟',
    ui.ButtonSet.YES_NO
  )
  if (answer !== ui.Button.YES) return
  clearSheets_()
  ui.alert('تم المسح. اللوحة فاضية. افتحي لوحة التحكم من جديد وابدئي.')
}

function clearSheets_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('السجل')
  if (!sheet) return
  const last = Math.max(sheet.getLastRow(), 2)
  if (last > 2) sheet.getRange(3, 1, last - 2, 9).clearContent()
}

function doGet() {
  return ContentService.createTextOutput('nova-net-ok')
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}')
    if (body.token !== TOKEN) return ContentService.createTextOutput('no')
    const lock = LockService.getScriptLock()
    lock.waitLock(15000)
    try {
      writeLog_(body.records || [])
    } finally {
      lock.releaseLock()
    }
    return ContentService.createTextOutput('ok')
  } catch (err) {
    return ContentService.createTextOutput(String(err))
  }
}

function writeLog_(rows) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('السجل')
  if (!sheet) return
  const width = 9
  const last = Math.max(sheet.getLastRow(), 2)
  if (last > 2) sheet.getRange(3, 1, last - 2, width).clearContent()
  if (!rows.length) return
  const values = rows.map((row) => {
    const copy = row.slice(0, width)
    while (copy.length < width) copy.push('')
    if (copy[8]) copy[8] = new Date(copy[8])
    return copy
  })
  sheet.getRange(3, 1, values.length, width).setValues(values)
}

function setupNet() {
  const ss = SpreadsheetApp.getActive()
  ss.rename('أي شبكة | نوفا')
  const cases = sheet_(ss, 'الحالات')
  const log = sheet_(ss, 'السجل')
  const girls = sheet_(ss, 'الطالبات')
  const board = sheet_(ss, 'لوحة المعلومات')
  ;[cases, log, girls, board].forEach((sheet) => {
    sheet.setRightToLeft(true)
    sheet.clear()
    sheet.getCharts().forEach((chart) => sheet.removeChart(chart))
  })

  cases.getRange(1, 1, 1, 12).setValues([[
    'رقم', 'الحالة', 'السؤال', 'الأصح', 'أ', 'ب', 'ج', 'السبب', 'أصوات أ', 'أصوات ب', 'أصوات ج', 'صحيحة',
  ]])
  CASES.forEach((row, index) => {
    const line = index + 2
    cases.getRange(line, 1, 1, 8).setValues([row])
    cases.getRange(line, 9, 1, 4).setFormulas([[
      `=COUNTIFS(السجل!$C$3:$C$500,A${line},السجل!$E$3:$E$500,"A")`,
      `=COUNTIFS(السجل!$C$3:$C$500,A${line},السجل!$E$3:$E$500,"B")`,
      `=COUNTIFS(السجل!$C$3:$C$500,A${line},السجل!$E$3:$E$500,"C")`,
      `=COUNTIFS(السجل!$C$3:$C$500,A${line},السجل!$H$3:$H$500,1)`,
    ]])
  })
  styleHeader_(cases, 12)
  cases.setFrozenRows(1)
  cases.setColumnWidth(2, 220)
  cases.setColumnWidth(3, 260)
  cases.setColumnWidth(8, 420)

  log.getRange(1, 1, 2, 9).setValues([
    ['سجل التصويت', '', '', '', '', '', '', '', ''],
    ['المفتاح', 'الاسم', 'رقم الحالة', 'الحالة', 'الخيار', 'نوع الشبكة', 'الثواني', 'صحيحة', 'الوقت'],
  ])
  log.getRange('I3:I800').setNumberFormat('yyyy-mm-dd hh:mm:ss')
  styleHeader_(log, 9, 2)
  log.setFrozenRows(2)
  log.setColumnWidth(2, 160)
  log.setColumnWidth(4, 220)
  log.setColumnWidth(6, 180)

  girls.getRange(1, 1, 1, 5).setValues([['الاسم', 'الأصوات', 'الصحيحة', 'متوسط الثواني', 'الدقة']])
  for (let row = 2; row <= 41; row++) {
    girls.getRange(row, 1, 1, 5).setFormulas([[
      `=IFERROR(INDEX(SORT(UNIQUE(FILTER(السجل!B$3:B$500,السجل!B$3:B$500<>""))),ROW()-1),"")`,
      `=IF(A${row}="","",COUNTIF(السجل!B$3:B$500,A${row}))`,
      `=IF(A${row}="","",COUNTIFS(السجل!B$3:B$500,A${row},السجل!H$3:H$500,1))`,
      `=IF(A${row}="",NA(),IFERROR(AVERAGEIF(السجل!B$3:B$500,A${row},السجل!G$3:G$500),NA()))`,
      `=IF(OR(A${row}="",B${row}=0),NA(),C${row}/B${row})`,
    ]])
  }
  girls.getRange('E2:E41').setNumberFormat('0%')
  girls.getRange('D2:D41').setNumberFormat('0.0')
  styleHeader_(girls, 5)
  girls.setFrozenRows(1)
  girls.setColumnWidth(1, 180)

  board.getRange('A1').setValue('أي شبكة؟ | لوحة المعلومات')
  board.getRange('A2').setValue('تتحدث مع كل تصويت. أغلقي لوحة التحكم قبل المسح.')
  board.getRange('A4:B4').setValues([['البند', 'القيمة']])
  const kpis = [
    ['عدد الأصوات', '=COUNTA(السجل!A3:A800)'],
    ['عدد الطالبات', '=SUMPRODUCT((الطالبات!A2:A41<>"")*1)'],
    ['الإجابات الصحيحة', '=COUNTIF(السجل!H3:H800,1)'],
    ['نسبة الصحة', '=IF(B5=0,"",B7/B5)'],
    ['الأسرع', '=IF(COUNT(الطالبات!D2:D41)=0,"—",IFERROR(INDEX(الطالبات!A2:A41,MATCH(MIN(FILTER(الطالبات!D2:D41,ISNUMBER(الطالبات!D2:D41))),الطالبات!D2:D41,0)),"—"))'],
    ['الأدق', '=IF(COUNT(الطالبات!E2:E41)=0,"—",IFERROR(INDEX(الطالبات!A2:A41,MATCH(MAX(FILTER(الطالبات!E2:E41,ISNUMBER(الطالبات!E2:E41))),الطالبات!E2:E41,0)),"—"))'],
    ['الأكثر صحة', '=IF(COUNT(الطالبات!C2:C41)=0,"—",IFERROR(INDEX(الطالبات!A2:A41,MATCH(MAX(FILTER(الطالبات!C2:C41,ISNUMBER(الطالبات!C2:C41))),الطالبات!C2:C41,0)),"—"))'],
  ]
  board.getRange(5, 1, kpis.length, 2).setValues(kpis)
  board.getRange('B8').setNumberFormat('0%')
  board.getRange('A1').setFontSize(26).setFontWeight('bold').setFontColor('#1c2433')
  board.getRange('A2').setFontColor('#5c6778')
  board.getRange('A4:B4').setBackground('#1c2433').setFontColor('#ffffff').setFontWeight('bold')
  board.getRange('A5:A11').setFontWeight('bold').setFontColor('#0b6a71')
  board.getRange('B5:B11').setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center')
  board.setColumnWidth(1, 180)
  board.setColumnWidth(2, 240)
  board.setHiddenGridlines(true)
  board.setRowHeight(1, 42)

  board.getRange('A16').setValue('مسح التجربة')
  board.getRange('B16').insertCheckboxes().setValue(false)
  board.getRange('A16:B16').setBackground('#e15a4a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(14)
  board.getRange('A16').setHorizontalAlignment('right')
  board.getRange('B16').setHorizontalAlignment('center')
  board.setRowHeight(16, 36)
  board.getRange('A17').setValue('علّمي المربع بعد التجربة. الحالات والرسوم تبقى. أغلقي لوحة التحكم قبل المسح.')
  board.getRange('A17').setFontColor('#5c6778').setFontSize(11)

  addChart_(board, girls, 'A2:A41', 'C2:C41', 'الإجابات الصحيحة', '#0e7c84', 4, 4)
  addChart_(board, girls, 'A2:A41', 'E2:E41', 'الدقة', '#c9a227', 4, 9)
  addChart_(board, cases, 'B2:B16', 'L2:L16', 'الصحيح في كل حالة', '#1c2433', 20, 4)
  addChart_(board, cases, 'B2:B16', 'I2:K16', 'توزيع أ و ب و ج', '#e15a4a', 20, 9)

  const leftover = ss.getSheetByName('Sheet1')
  if (leftover && ss.getSheets().length > 1) ss.deleteSheet(leftover)
  board.activate()
}

function addChart_(board, source, labels, values, title, color, row, column) {
  const chart = board.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(source.getRange(labels))
    .addRange(source.getRange(values))
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', title)
    .setOption('legend', { position: values.indexOf(':K') === -1 ? 'none' : 'top' })
    .setOption('colors', values.indexOf(':K') === -1 ? [color] : ['#c9a227', '#0e7c84', '#e15a4a'])
    .setOption('backgroundColor', '#fffaf3')
    .setOption('titleTextStyle', { fontSize: 16, bold: true, color: '#1c2433' })
    .setOption('height', 320)
    .setOption('width', 480)
    .setPosition(row, column, 0, 0)
    .build()
  board.insertChart(chart)
}

function sheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name)
}

function styleHeader_(sheet, width, row) {
  const header = row || 1
  sheet.getRange(header, 1, 1, width).setBackground('#1c2433').setFontColor('#ffffff').setFontWeight('bold')
  sheet.setRowHeight(header, 28)
}
