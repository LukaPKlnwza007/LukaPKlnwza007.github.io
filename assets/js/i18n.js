/* ============================================================================
   i18n.js - Thai and English, and the switch between them
   ----------------------------------------------------------------------------
   Two jobs:

     1. Decide which language the page is in, before anything renders. Loads
        first, ahead of data.js, so data.js can resolve its own strings once
        rather than every reader having to ask.
     2. Hold the wording that lives in the pages rather than in data.js -
        headings, labels, prose - and write it into [data-i18n] elements.

   Every English string stays in the HTML as the element's own text. So with
   no JavaScript, or if this file fails, the page is a working English page
   rather than a set of empty boxes.

   Switching reloads the page. The alternative is teaching six render scripts
   to tear down and rebuild themselves, and a reload is both simpler and
   impossible to get subtly wrong. It is also what the visitor expects.
   ========================================================================= */
window.I18N = (function () {
  'use strict';

  const SUPPORTED = ['en', 'th'];
  const STORE_KEY = 'portfolio-lang';

  /* ---------- Wording that lives in the pages ----------------------------
     Flat keys, both languages side by side, so a missing translation is
     obvious when reading rather than something you find in the browser.
     --------------------------------------------------------------------- */
  const S = {
    /* -- chrome ---------------------------------------------------------- */
    'nav.index':   { en: 'index',       th: 'หน้าแรก' },
    'nav.about':   { en: 'about',       th: 'ประวัติ' },
    'nav.work':    { en: 'work',        th: 'ผลงาน' },
    'nav.contact': { en: 'contact',     th: 'ติดต่อ' },
    'nav.cta':     { en: 'Get in touch', th: 'ติดต่อผม' },
    'nav.menu':    { en: 'Toggle menu', th: 'เปิดปิดเมนู' },
    'lang.group':  { en: 'Language',    th: 'ภาษา' },

    // <title> is an element like any other, so data-i18n reaches it too.
    'title.index':   { en: 'Denpoom Lothaisong', th: 'เด่นภูมิ โลไธสงค์' },
    'title.about':   { en: 'Personal History · Denpoom Lothaisong', th: 'ประวัติส่วนตัว · เด่นภูมิ โลไธสงค์' },
    'title.work':    { en: 'My Personal Works · Denpoom Lothaisong', th: 'ผลงานของผม · เด่นภูมิ โลไธสงค์' },
    'title.contact': { en: 'Contact Information · Denpoom Lothaisong', th: 'ข้อมูลติดต่อ · เด่นภูมิ โลไธสงค์' },

    'skip':        { en: 'Skip to content', th: 'ข้ามไปที่เนื้อหา' },
    'footer.colophon': {
      en: 'Set in Chakra Petch, Anuphan and Space Mono. Hand-written HTML, CSS and ' +
          'JavaScript, one Three.js scene, a Spring Boot endpoint behind the ' +
          'contact form. No analytics, no cookie banner, nothing to accept.',
      th: 'ใช้ฟอนต์ Chakra Petch, Anuphan และ Space Mono เขียน ' +
          'HTML, CSS และ JavaScript เองทั้งหมด มีฉาก Three.js หนึ่งฉาก และ ' +
          'Spring Boot อยู่หลังฟอร์มติดต่อ ไม่มีตัวเก็บสถิติ ไม่มีแบนเนอร์คุกกี้ ' +
          'ไม่มีอะไรให้ต้องกดยอมรับ'
    },

    /* -- home ------------------------------------------------------------ */
    'home.seeWork':      { en: 'See the work',   th: 'ดูผลงาน' },
    'home.hudIdentity':  { en: 'IDENTITY',       th: 'ข้อมูลส่วนตัว' },
    'home.hudCurrent':   { en: 'CURRENT',        th: 'ตอนนี้' },
    'home.hudAvailable': { en: 'Available',      th: 'ว่าง' },
    'home.hudWorksOn':   { en: 'Works on',       th: 'ทำเกี่ยวกับ' },
    'home.hudReplies':   { en: 'Replies',        th: 'ตอบกลับ' },
    'home.afterSchool':  { en: 'After school',   th: 'หลังเลิกเรียน' },
    'home.portraitAlt':  { en: 'Portrait of Denpoom Lothaisong', th: 'รูปเด่นภูมิ โลไธสงค์' },

    'home.workTitle': { en: 'My Favorite Personal Works', th: 'ผลงานที่ผมชอบที่สุด' },
    'home.workLede': {
      en: 'A short list, because I am in M5 and I started recently. But ' +
          'everything on it is something I actually made or actually turned up to.',
      th: 'รายการสั้น ๆ เพราะผมอยู่ ม.5 และเพิ่งเริ่มได้ไม่นาน แต่ทุกอย่างในนี้ ' +
          'ผมทำเองจริง หรือไปร่วมงานเองจริง'
    },
    'home.indexTitle': { en: 'All my work and projects', th: 'ผลงานและโปรเจกต์ทั้งหมด' },
    'home.indexLede': {
      en: 'Everything on the site, in one list. Pick a row and it opens that ' +
          'project in the work section.',
      th: 'ทุกอย่างบนเว็บนี้ รวมไว้ในรายการเดียว เลือกแถวไหนก็ได้ ' +
          'แล้วมันจะพาไปที่โปรเจกต์นั้นในหน้าผลงาน'
    },
    'home.openWork': { en: 'Open the work section', th: 'เปิดหน้าผลงาน' },

    'home.notesTitle': { en: 'How I actually build things', th: 'ผมทำของยังไงจริง ๆ' },
    'home.notesP1': {
      en: 'I start with the smallest piece that can prove itself. On the traffic ' +
          'light that meant getting the sensor to print one number and waving my ' +
          'hand at it until the number made sense. Nothing else got wired until ' +
          'that part was boring.',
      th: 'ผมเริ่มจากชิ้นเล็กที่สุดที่พิสูจน์ตัวเองได้ก่อน กับไฟจราจรก็คือทำให้ ' +
          'เซ็นเซอร์พิมพ์ตัวเลขออกมาตัวเดียว แล้วเอามือโบกไปมาจนตัวเลขนั้นสมเหตุสมผล ' +
          'ผมไม่ต่อสายอย่างอื่นเลย จนกว่าส่วนนั้นจะน่าเบื่อ'
    },
    'home.notesP2': {
      en: 'Then one thing at a time. This is not patience, it is self-defence. ' +
          'The day I wired all of it at once and it did not work, I had three ' +
          'suspects and no way to tell which one did it. Adding one piece at a ' +
          'time means the thing that broke it is the thing I just touched.',
      th: 'จากนั้นก็ทีละอย่าง อันนี้ไม่ใช่ความอดทน แต่เป็นการป้องกันตัว ' +
          'วันที่ผมต่อทุกอย่างพร้อมกันแล้วมันไม่ทำงาน ผมมีผู้ต้องสงสัยสามตัว ' +
          'และไม่มีทางรู้เลยว่าตัวไหนทำ การเพิ่มทีละชิ้นแปลว่าสิ่งที่ทำให้พัง ' +
          'คือสิ่งที่ผมเพิ่งแตะไปเมื่อกี้'
    },
    'home.notesP3': {
      en: 'I look things up constantly and I am not embarrassed about that. What ' +
          'I try not to do is paste something in without understanding it, ' +
          'because that works right until it does not, and then I am stuck with ' +
          'code I cannot read in a project that is due tomorrow.',
      th: 'ผมเปิดหาข้อมูลตลอดเวลา และไม่เขินที่จะบอก สิ่งที่ผมพยายามไม่ทำคือ ' +
          'ก๊อปโค้ดมาวางโดยไม่เข้าใจ เพราะมันจะใช้ได้จนถึงวันที่มันใช้ไม่ได้ ' +
          'แล้วผมก็จะติดอยู่กับโค้ดที่อ่านไม่ออก ในงานที่ต้องส่งพรุ่งนี้'
    },
    'home.notYet':  { en: 'NOT YET', th: 'ยังไม่ได้' },
    'home.notYet1': {
      en: 'Databases. I know they exist. That is roughly the extent of it.',
      th: 'ฐานข้อมูล ผมรู้ว่ามันมีอยู่ ประมาณนั้นแหละ'
    },
    'home.notYet2': {
      en: 'JavaScript frameworks, until plain JavaScript stops surprising me.',
      th: 'เฟรมเวิร์ก JavaScript ขอให้ JavaScript เปล่า ๆ เลิกทำผมงงก่อน'
    },
    'home.notYet3': {
      en: 'Soldering that does not look like a crime scene.',
      th: 'บัดกรีให้ไม่เหมือนที่เกิดเหตุ'
    },
    'home.notYet4': {
      en: '3D modelling. Every attempt so far has come out like a melted chair.',
      th: 'โมเดล 3 มิติ ที่ลองมาทุกครั้งออกมาเหมือนเก้าอี้ละลาย'
    },
    'home.notYetNote': {
      en: 'This is the list of what is next, not a confession. I would rather ' +
          'write down what I cannot do yet than pretend the list is empty.',
      th: 'นี่คือรายการของสิ่งที่จะทำต่อ ไม่ใช่คำสารภาพ ผมขอเขียนสิ่งที่ยังทำไม่ได้ ' +
          'ดีกว่าแกล้งทำเป็นว่ารายการนี้ว่างเปล่า'
    },
    'home.sayHello': { en: 'Say hello', th: 'ทักมาได้เลย' },
    'home.sayHelloLede': {
      en: 'A question, a project, a competition that needs one more person, or a ' +
          'note telling me something on this site is wrong. All welcome.',
      th: 'คำถาม โปรเจกต์ การแข่งขันที่ยังขาดคนอีกหนึ่ง หรือจะบอกว่ามีอะไรผิด ' +
          'บนเว็บนี้ก็ได้ ยินดีหมด'
    },

    /* -- about ----------------------------------------------------------- */
    'about.title': { en: 'Personal History', th: 'ประวัติส่วนตัว' },
    'about.lede': {
      en: 'Websites, and things that beep. This page is how I got here, which is ' +
          'mostly a list of things I broke and then had to understand.',
      th: 'เว็บไซต์ กับของที่ส่งเสียงบี๊บ หน้านี้คือเรื่องที่พาผมมาถึงตรงนี้ ' +
          'ซึ่งส่วนใหญ่เป็นรายการของที่ผมทำพัง แล้วต้องไปหาให้ได้ว่าทำไม'
    },
    'about.metaYear':   { en: 'year',   th: 'ชั้นปี' },
    'about.metaSchool': { en: 'school', th: 'โรงเรียน' },
    'about.metaBased':  { en: 'based',  th: 'อยู่ที่' },

    'about.bioTitle': { en: 'Biography', th: 'ชีวประวัติ' },
    'about.bioP1': {
      en: 'I make stuff. Mostly websites, and mostly hardware, and the best days ' +
          'are when it is both — a page that talks to something sitting on my desk.',
      th: 'ผมทำของ ส่วนใหญ่เป็นเว็บไซต์ กับฮาร์ดแวร์ และวันที่ดีที่สุดคือวันที่ได้ทำ ' +
          'ทั้งสองอย่างพร้อมกัน — หน้าเว็บที่คุยกับของที่วางอยู่บนโต๊ะผม'
    },
    'about.bioP2': {
      en: 'It started with the family computer and a folder I was not supposed ' +
          'to open. I changed things, broke things, and had to work out what ' +
          'System Restore was for. Somewhere in the middle of fixing it I ' +
          'realised the machine was not magic. It was a very large pile of ' +
          'instructions, and instructions can be read.',
      th: 'มันเริ่มจากคอมพิวเตอร์ที่บ้าน กับโฟลเดอร์ที่ผมไม่ควรเปิด ผมไปแก้นู่นแก้นี่ ' +
          'ทำพัง แล้วต้องมานั่งหาว่า System Restore มีไว้ทำอะไร ระหว่างที่ซ่อมอยู่ ' +
          'นั่นแหละ ผมถึงรู้ว่าเครื่องมันไม่ได้วิเศษอะไร มันคือกองคำสั่งใหญ่ ๆ กองหนึ่ง ' +
          'และคำสั่งเป็นสิ่งที่อ่านได้'
    },
    'about.bioP3': {
      en: 'Now it is HTML and CSS for anything on a screen, and C for anything ' +
          'with a sensor on it. I am in Mathayom 5, so most of what I make is ' +
          'school work or something I got curious about at eleven at night. I am ' +
          'fine with that. Everything on this site is something I actually made, ' +
          'which matters to me more than the list being long.',
      th: 'ตอนนี้ก็เป็น HTML กับ CSS สำหรับอะไรที่อยู่บนจอ และภาษา C สำหรับอะไร ' +
          'ที่มีเซ็นเซอร์ติดอยู่ ผมอยู่ ม.5 ของส่วนใหญ่ที่ทำเลยเป็นงานโรงเรียน ' +
          'หรือของที่อยู่ ๆ ก็อยากรู้ตอนห้าทุ่ม ผมโอเคกับตรงนั้น ทุกอย่างบนเว็บนี้ ' +
          'ผมทำเองจริง ๆ ซึ่งสำคัญกับผมมากกว่าการมีรายการยาว ๆ'
    },
    'about.bioP4': {
      en: 'The one I am proudest of is a traffic light that checks whether ' +
          'anybody is standing there before it decides to change. It is not ' +
          'complicated. But it is mine, and the first time that green LED came ' +
          'on because I walked in front of a sensor, I stood there and did it ' +
          'again about twenty times.',
      th: 'อันที่ผมภูมิใจที่สุดคือไฟจราจรที่เช็กก่อนว่ามีคนยืนอยู่ไหม ค่อยตัดสินใจ ' +
          'เปลี่ยนไฟ มันไม่ได้ซับซ้อนอะไร แต่มันเป็นของผม และครั้งแรกที่ไฟ LED ' +
          'สีเขียวติดขึ้นมาเพราะผมเดินผ่านหน้าเซ็นเซอร์ ผมยืนทำซ้ำอยู่ตรงนั้น ' +
          'อีกประมาณยี่สิบรอบ'
    },

    'about.setupTitle':  { en: 'CURRENT SETUP',  th: 'ของที่ใช้อยู่' },
    'about.setupEditor': { en: 'Editor',         th: 'โปรแกรมเขียนโค้ด' },
    'about.setupBoard':  { en: 'Board',          th: 'บอร์ด' },
    'about.setupSensor': { en: 'Sensor',         th: 'เซ็นเซอร์' },
    'about.setupDrawer': { en: 'Drawer',         th: 'ในลิ้นชัก' },
    'about.setupVcs':    { en: 'Version control', th: 'เก็บเวอร์ชัน' },
    'about.setupDebug':  { en: 'Debug method',   th: 'วิธีหาบั๊ก' },
    'about.setupSensorV': { en: 'HC-SR04 ultrasonic', th: 'HC-SR04 อัลตราโซนิก' },
    'about.setupDrawerV': {
      en: 'LEDs, resistors, too many jumper wires',
      th: 'LED ตัวต้านทาน และสายจัมเปอร์เยอะเกินจำเป็น'
    },
    'about.setupDebugV': { en: 'print, then more print', th: 'print แล้วก็ print อีก' },
    'about.setupNote': {
      en: 'Every piece of hardware on this list has been unplugged and plugged ' +
          'back in more times than it has been programmed.',
      th: 'ฮาร์ดแวร์ทุกชิ้นในรายการนี้ ถูกถอดแล้วเสียบกลับ มากกว่าจำนวนครั้ง ' +
          'ที่ถูกเขียนโปรแกรมลงไป'
    },

    'about.timelineTitle': { en: 'Where the time went', th: 'เวลาที่ผ่านมาหายไปไหน' },
    'about.timelineLede': {
      en: 'The line on the left fills as you read. Lit markers are behind you.',
      th: 'เส้นด้านซ้ายจะค่อย ๆ เติมขึ้นตอนคุณอ่าน จุดที่สว่างแล้วคือสิ่งที่ผ่านไปแล้ว'
    },
    'about.skillsTitle': { en: 'Skills', th: 'ทักษะ' },
    'about.skillsLede': {
      en: 'No percentages. A number next to a skill is a number somebody made ' +
          'up, and everyone reading it knows that. This is just what I use.',
      th: 'ไม่มีเปอร์เซ็นต์ ตัวเลขข้างทักษะคือตัวเลขที่ใครสักคนคิดขึ้นมาเอง ' +
          'และคนอ่านก็รู้กันหมด นี่คือสิ่งที่ผมใช้จริง ๆ เฉย ๆ'
    },
    'about.enoughTitle': { en: 'Enough about me', th: 'พอแล้วเรื่องผม' },
    'about.enoughLede': {
      en: 'The work pages have the actual things: what I was trying to do, what ' +
          'I did, and what I got wrong on the way.',
      th: 'หน้าผลงานมีของจริง ๆ อยู่ ว่าผมพยายามจะทำอะไร ทำอะไรไปบ้าง ' +
          'และพลาดตรงไหนระหว่างทาง'
    },

    /* -- work ------------------------------------------------------------ */
    'work.title': { en: 'My Personal Works', th: 'ผลงานของผม' },
    'work.lede': {
      en: 'Everything I have made or turned up to. It is a short list and I am ' +
          'not going to pad it out with things I did not do. Filter by kind, or ' +
          'just read them in order.',
      th: 'ทุกอย่างที่ผมทำเอง หรือไปร่วมมาเอง เป็นรายการสั้น ๆ และผมจะไม่เอาของ ' +
          'ที่ไม่ได้ทำมาใส่ให้ดูเยอะ กรองตามประเภท หรืออ่านไล่ไปทีละอันก็ได้'
    },
    'work.filter': { en: 'filter', th: 'กรอง' },
    'work.empty':  { en: 'Nothing in that category. Try another.', th: 'ไม่มีอะไรในหมวดนั้น ลองหมวดอื่นดู' },
    'work.showing': { en: 'showing {n} of {total}', th: 'แสดง {n} จาก {total}' },
    'work.moreTitle': { en: 'More coming', th: 'ยังมีมาอีก' },
    'work.moreLede': {
      en: 'This is everything so far. The list is short because I started ' +
          'recently, not because I trimmed it. Ask me what I am working on right now.',
      th: 'ตอนนี้มีเท่านี้ รายการสั้นเพราะผมเพิ่งเริ่ม ไม่ใช่เพราะตัดออก ' +
          'ถามได้ว่าตอนนี้ผมกำลังทำอะไรอยู่'
    },

    /* -- project detail -------------------------------------------------- */
    'detail.allWork':   { en: '← all work',  th: '← ผลงานทั้งหมด' },
    'detail.problem':   { en: 'The problem',      th: 'โจทย์' },
    'detail.whatIDid':  { en: 'What I did',       th: 'ผมทำอะไรไป' },
    'detail.learned':   { en: 'What I learned',   th: 'ได้อะไรกลับมา' },
    'detail.photos':    { en: 'Photos',           th: 'รูป' },
    'detail.data':      { en: 'PROJECT DATA',     th: 'ข้อมูลโปรเจกต์' },
    'detail.client':    { en: 'Client',           th: 'งานของ' },
    'detail.kind':      { en: 'Kind',             th: 'ประเภท' },
    'detail.year':      { en: 'Year',             th: 'ปี' },
    'detail.duration':  { en: 'Duration',         th: 'ใช้เวลา' },
    'detail.builtWith': { en: 'Built with',       th: 'ใช้อะไรทำ' },
    'detail.metaYear':  { en: 'year',             th: 'ปี' },
    'detail.metaRole':  { en: 'role',             th: 'หน้าที่' },
    'detail.metaDuration': { en: 'duration',      th: 'ใช้เวลา' },
    'detail.prev':      { en: '← previous',  th: '← ก่อนหน้า' },
    'detail.next':      { en: 'next →',      th: 'ถัดไป →' },
    'detail.missingTitle': { en: 'That project is not here', th: 'ไม่มีโปรเจกต์นี้' },
    'detail.missingLede': {
      en: 'Either the link is wrong or I moved it. The full list is one click away.',
      th: 'ไม่ลิงก์ผิด ก็ผมย้ายมันไปแล้ว รายการทั้งหมดอยู่ห่างไปแค่คลิกเดียว'
    },
    'detail.notFound':  { en: 'Not found',        th: 'ไม่พบหน้านี้' },
    'card.readIt':      { en: 'Read it',          th: 'อ่านต่อ' },
    'card.open':        { en: 'Open {name}',      th: 'เปิด {name}' },
    'card.coverAlt':    { en: 'Cover photo for {name}', th: 'ภาพหน้าปกของ {name}' },

    /* -- contact --------------------------------------------------------- */
    'contact.title': { en: 'Contact Information', th: 'ข้อมูลติดต่อ' },
    'contact.lede': {
      en: 'Email is easiest. Say hello, ask a question, or tell me something on ' +
          'this site is wrong. I check it when I get home from school.',
      th: 'อีเมลง่ายที่สุด ทักมาคุย ถามอะไรก็ได้ หรือจะบอกว่ามีอะไรผิดบนเว็บนี้ ' +
          'ผมเช็กตอนกลับถึงบ้าน'
    },
    'contact.message':  { en: 'MESSAGE', th: 'ข้อความ' },
    'contact.name':     { en: 'Name',    th: 'ชื่อ' },
    'contact.email':    { en: 'Email',   th: 'อีเมล' },
    'contact.subject':  { en: 'Subject', th: 'เรื่อง' },
    'contact.msg':      { en: 'Message', th: 'ข้อความ' },
    'contact.phName':   { en: 'Your name', th: 'ชื่อของคุณ' },
    'contact.phEmail':  { en: 'you@example.com', th: 'you@example.com' },
    'contact.phSubject': {
      en: 'e.g. a question about the traffic light',
      th: 'เช่น อยากถามเรื่องไฟจราจร'
    },
    'contact.phMessage': { en: 'Whatever you want to say.', th: 'อยากบอกอะไรก็เขียนได้เลย' },
    'contact.send':     { en: 'Send message', th: 'ส่งข้อความ' },
    'contact.direct':   { en: 'DIRECT LINES', th: 'ช่องทางตรง' },
    'contact.directLede': {
      en: 'If the form is being difficult, or you would rather not use one, any ' +
          'of these reaches me directly.',
      th: 'ถ้าฟอร์มมีปัญหา หรือไม่อยากกรอกฟอร์ม ช่องทางพวกนี้ถึงตัวผมโดยตรง'
    },
    'contact.practical': { en: 'PRACTICALITIES', th: 'ข้อมูลทั่วไป' },
    'contact.timezone':  { en: 'Timezone',   th: 'เขตเวลา' },
    'contact.replyTime': { en: 'Reply time', th: 'เวลาตอบ' },
    'contact.basedIn':   { en: 'Based in',   th: 'อยู่ที่' },
    'contact.gradeRow':  { en: 'Year',       th: 'ชั้นปี' },
    'contact.languages': { en: 'Languages',  th: 'ภาษา' },
    'contact.languagesV': { en: 'Thai, English', th: 'ไทย, อังกฤษ' },
    'contact.backendNote': {
      en: 'This form posts to a Spring Boot service I wrote, which lives in ' +
          'backend/ and is not hosted anywhere yet. So on this site it will fail ' +
          'and hand you my email address instead of pretending it worked. Email ' +
          'me directly and save yourself a step.',
      th: 'ฟอร์มนี้ส่งไปที่ Spring Boot ที่ผมเขียนเอง ซึ่งอยู่ในโฟลเดอร์ backend/ ' +
          'และยังไม่ได้เอาขึ้นเซิร์ฟเวอร์ที่ไหน บนเว็บนี้มันเลยจะส่งไม่ผ่าน ' +
          'แล้วโยนอีเมลผมให้แทน ไม่แกล้งทำเป็นว่าส่งสำเร็จ อีเมลมาตรง ๆ ' +
          'จะประหยัดเวลาไปหนึ่งขั้น'
    },

    /* -- contact form, spoken by contact-form.js ------------------------- */
    'form.nameLen':    { en: 'Between 2 and 80 characters, please', th: 'ขอความยาว 2 ถึง 80 ตัวอักษร' },
    'form.badEmail':   { en: 'That does not look like an email address', th: 'อันนี้ดูไม่เหมือนอีเมล' },
    'form.msgLen':     { en: 'At least 10 characters, up to 2,000', th: 'อย่างน้อย 10 ตัวอักษร ไม่เกิน 2,000' },
    'form.checkFields': { en: 'Some fields need another look', th: 'มีบางช่องที่ต้องดูอีกที' },
    'form.sending':    { en: 'Sending…', th: 'กำลังส่ง…' },
    'form.sent':       { en: 'Sent. I will reply when I get home.', th: 'ส่งแล้ว เดี๋ยวผมตอบตอนกลับถึงบ้าน' },
    'form.rateLimit':  { en: 'That is a lot of messages. Try again shortly.', th: 'ส่งถี่ไปหน่อย อีกสักครู่ค่อยลองใหม่' },
    'form.rejected':   { en: 'The server rejected some of that', th: 'เซิร์ฟเวอร์ไม่รับข้อมูลบางส่วน' },
    'form.unreachable': { en: 'Could not reach the server. Reach me directly at', th: 'ติดต่อเซิร์ฟเวอร์ไม่ได้ อีเมลหาผมตรง ๆ ที่' },
    'form.timedOut':   { en: 'The server is not answering. Reach me directly at', th: 'เซิร์ฟเวอร์ไม่ตอบ อีเมลหาผมตรง ๆ ที่' }
  };

  /* ---------- Which language ---------------------------------------------
     ?lang= wins, so a link can point at one. Then whatever was chosen last.
     Then the browser's own preference, so a Thai visitor gets Thai first.
     --------------------------------------------------------------------- */
  function chooseLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.indexOf(q) !== -1) return q;

    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) { /* private mode */ }

    const nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('th') === 0 ? 'th' : 'en';
  }

  const lang = chooseLang();

  // Set before anything renders: the CSS keys Thai typography off data-lang,
  // and lang= is what a screen reader reads the page with.
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);

  /** One string. Unknown keys come back as the key, which is visible in
   *  testing rather than silently blank. */
  function t(key, vars) {
    const entry = S[key];
    let out = entry ? (entry[lang] || entry.en) : key;
    if (vars) {
      for (const k in vars) out = out.split('{' + k + '}').join(vars[k]);
    }
    return out;
  }

  /** Resolve a { en, th } pair from data.js. Anything else passes through, so
   *  a value that does not need translating can just be written plainly. */
  function pick(value) {
    if (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value) {
      return value[lang] !== undefined ? value[lang] : value.en;
    }
    return value;
  }

  /** Write the strings into the page. data-i18n sets text; data-i18n-attr
   *  takes "attr:key" pairs for placeholders, labels and the like. */
  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    (root || document).querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
        const bits = pair.split(':');
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });
  }

  function set(next) {
    if (SUPPORTED.indexOf(next) === -1 || next === lang) return;
    try { localStorage.setItem(STORE_KEY, next); } catch (_) {}

    // Drop ?lang= so the stored choice is not immediately overridden by a
    // stale query string on the next load.
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    location.replace(url.toString());
  }

  return { lang, other: lang === 'th' ? 'en' : 'th', supported: SUPPORTED, t, pick, apply, set };
})();

/* Deferred scripts run after the document is parsed, so the elements are
   already here and this can run straight away rather than waiting. */
window.I18N.apply();

/* The switch in the nav. Real buttons, and the current one is marked pressed
   rather than only coloured, so it is not a colour-only distinction. */
document.querySelectorAll('[data-lang-set]').forEach(btn => {
  const to = btn.getAttribute('data-lang-set');
  const current = to === window.I18N.lang;
  btn.setAttribute('aria-pressed', String(current));
  btn.classList.toggle('is-on', current);
  btn.addEventListener('click', () => window.I18N.set(to));
});
