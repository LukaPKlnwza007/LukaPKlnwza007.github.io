/* ============================================================================
   data.js - every word on this site lives here.
   ----------------------------------------------------------------------------
   Change your details in this one file and all five pages follow.
   Look for « EDIT » markers, and « CHECK » where I guessed at something.
   ----------------------------------------------------------------------------
   Bilingual. Anything a visitor reads is written as { en: '…', th: '…' } and
   resolved once, here, by the language i18n.js already settled on. Nothing
   downstream has to know there are two languages - by the time home.js or
   projects-filter.js reads a value it is a plain string.

   Must load after i18n.js and before every other script.
   ========================================================================= */

window.PORTFOLIO = (function () {
  'use strict';

  // Resolve a { en, th } pair to the current language. Arrays of strings get
  // wrapped whole - { en: [...], th: [...] } - rather than item by item.
  const t = (window.I18N && window.I18N.pick) || (v => (v && v.en !== undefined ? v.en : v));

  /* ---------- 1. Identity « EDIT » -------------------------------------- */
  const identity = {
    name: t({ en: 'Denpoom Lothaisong', th: 'เด่นภูมิ โลไธสงค์' }),
    // Kept in both, because the hero splits the name across two lines.
    firstName: t({ en: 'Denpoom', th: 'เด่นภูมิ' }),
    lastName:  t({ en: 'Lothaisong', th: 'โลไธสงค์' }),
    handle:   'LukaPKlnwza007',
    callsign: 'DENPOOM',                  // nav, boot screen, HUD
    role: t({
      en: 'Websites, and hardware that beeps at things',
      th: 'ทำเว็บไซต์ กับฮาร์ดแวร์ที่ส่งเสียงบี๊บใส่ของ'
    }),
    roleShort: t({ en: 'Web / Hardware', th: 'เว็บ / ฮาร์ดแวร์' }),
    tagline: t({
      en: 'I make websites, and I wire up sensors until something beeps at ' +
          'the right moment. Most of what I know I learned by breaking it ' +
          'first, then working out why.',
      th: 'ผมทำเว็บไซต์ และต่อสายเซ็นเซอร์ไปเรื่อย ๆ จนกว่าจะมีอะไรสักอย่าง ' +
          'ส่งเสียงบี๊บถูกจังหวะ ส่วนใหญ่ที่ผมรู้ มาจากการทำมันพังก่อน ' +
          'แล้วค่อยไปหาว่าทำไม'
    }),
    location: t({ en: 'Loei, Thailand', th: 'จังหวัดเลย ประเทศไทย' }),
    school:   t({ en: 'Loei Pittayakom School', th: 'โรงเรียนเลยพิทยาคม' }),
    grade:    t({ en: 'Mathayom 5', th: 'มัธยมศึกษาปีที่ 5' }),
    photo:    'assets/img/profile.jpg',   // portrait on the home page
    timezone: t({ en: 'ICT / UTC+7', th: 'ICT / UTC+7' }),
    available: true,
    availableText: t({ en: 'Free after school', th: 'ว่างหลังเลิกเรียน' }),
    email: 'lpk40868@loeipit.ac.th',
    since: 2023,                          // « CHECK » first year I wrote anything
    // Contact API endpoint. The Spring Boot service in backend/ is not deployed
    // anywhere, so on GitHub Pages the form fails politely and hands over the
    // email address instead. Point this at a real host to turn it on.
    contactEndpoint: 'http://localhost:8080/api/contact'
  };

  /* ---------- 2. Links « EDIT » ----------------------------------------- */
  const socials = [
    { label: 'GitHub', handle: 'github.com/' + identity.handle, href: 'https://github.com/' + identity.handle },
    { label: t({ en: 'Email', th: 'อีเมล' }), handle: identity.email, href: 'mailto:' + identity.email }
  ];

  /* ---------- 3. How I got here « CHECK EVERY LINE » ---------------------
     Written from what you told me: M5, websites and hardware, HTML/CSS/C, the
     traffic light, and the KKU competition. The years and the small stories
     are my guesses at a plausible order. Fix anything that is not true.
     -------------------------------------------------------------------- */
  const timeline = [
    {
      year: '2026',
      role: t({
        en: 'Went to a competition and lost to a dirt road',
        th: 'ไปแข่ง แล้วแพ้ให้ถนนลูกรัง'
      }),
      org: t({
        en: 'Geoinformatics Challenge, College of Computing, KKU',
        th: 'Geoinformatics Challenge วิทยาลัยการคอมพิวเตอร์ ม.ขอนแก่น'
      }),
      desc: t({
        en: 'Our school sent a team to the 4th Computing Fair. The event was ' +
            'GeoGuessr: you get dropped somewhere in the world and you have to ' +
            'work out where from road signs, power poles and which side of the ' +
            'road the cars are on. I now know more about Thai highway markers ' +
            'than is reasonable for someone my age.',
        th: 'โรงเรียนส่งทีมไปงาน 4th Computing Fair รายการที่แข่งคือ GeoGuessr ' +
            'คือโดนหย่อนลงที่ไหนสักแห่งบนโลก แล้วต้องเดาให้ได้ว่าที่ไหน จากป้ายถนน ' +
            'เสาไฟ และรถวิ่งเลนไหน ตอนนี้ผมรู้เรื่องหลักกิโลเมตรบนถนนไทย ' +
            'มากเกินกว่าที่เด็กอายุเท่าผมควรจะรู้'
      })
    },
    {
      year: '2025',
      role: t({ en: 'Things that beep', th: 'ของที่ส่งเสียงบี๊บ' }),
      org:  t({ en: 'A breadboard on my desk', th: 'เบรดบอร์ดบนโต๊ะผม' }),
      desc: t({
        en: 'Started on C and sensors. The first time something I wrote made a ' +
            'light turn on in the actual room, not on a screen, I understood why ' +
            'people do this. Also learned that a loose jumper wire will cost you ' +
            'two hours and your dignity.',
        th: 'เริ่มเรียนภาษา C กับเซ็นเซอร์ ครั้งแรกที่โค้ดที่ผมเขียนทำให้ไฟติดขึ้นมา ' +
            'ในห้องจริง ไม่ใช่บนจอ ผมถึงเข้าใจว่าทำไมคนถึงทำสิ่งนี้กัน ' +
            'แล้วก็ได้รู้ด้วยว่าสายจัมเปอร์หลวมเส้นเดียว กินเวลาไปสองชั่วโมง ' +
            'พร้อมศักดิ์ศรีอีกก้อนหนึ่ง'
      })
    },
    {
      year: '2024',
      role: t({ en: 'First page that was mine', th: 'หน้าเว็บแรกที่เป็นของผมเอง' }),
      org:  t({
        en: 'Computer class, then at home instead of sleeping',
        th: 'คาบคอมพิวเตอร์ แล้วก็ต่อที่บ้านแทนที่จะนอน'
      }),
      desc: t({
        en: 'HTML and CSS. My first page was three colours, all of them wrong, ' +
            'and a centred div I fought for a week. But it was mine, it opened ' +
            'in a browser, and that was enough to keep going.',
        th: 'HTML กับ CSS หน้าแรกของผมมีสามสี ผิดทั้งสามสี กับ div ที่จัดกลาง ' +
            'ไม่ได้อยู่อาทิตย์หนึ่ง แต่มันเป็นของผม มันเปิดในเบราว์เซอร์ได้ ' +
            'แค่นั้นก็พอให้ทำต่อแล้ว'
      })
    },
    {
      year: '2023',
      role: t({ en: 'Opened a folder I should not have', th: 'เปิดโฟลเดอร์ที่ไม่ควรเปิด' }),
      org:  t({ en: 'The family computer', th: 'คอมพิวเตอร์ที่บ้าน' }),
      desc: t({
        en: 'I got curious about what was actually inside the machine instead of ' +
            'just using it. Changed some settings. Broke some things. Learned ' +
            'what System Restore is for. Genuinely where this started.',
        th: 'ผมเริ่มอยากรู้ว่าข้างในเครื่องมันมีอะไร แทนที่จะใช้มันเฉย ๆ ' +
            'ไปเปลี่ยนการตั้งค่าบางอย่าง ทำพังไปบ้าง ได้รู้ว่า System Restore ' +
            'มีไว้ทำอะไร จุดเริ่มต้นจริง ๆ อยู่ตรงนั้น'
      })
    }
  ];

  /* ---------- 4. Skills « EDIT » -----------------------------------------
     Just names. A percentage next to a skill is a number somebody invented,
     and everybody reading it knows that. */
  const skills = t({
    en: ['HTML', 'CSS', 'C', 'Sensors and breadboards'],
    th: ['HTML', 'CSS', 'C', 'เซ็นเซอร์และเบรดบอร์ด']
  });

  /* ---------- 5. Ticker under the hero ----------------------------------- */
  const stack = [
    'html', 'css', 'c', 'arduino', 'ultrasonic sensor', 'breadboard',
    'jumper wires', 'leds', 'git', 'vs code', 'and a lot of tape'
  ];

  /* ---------- 6. Work « EDIT » -------------------------------------------
     id        → project-detail.html?id=<id>
     featured  → true puts it on the home page
     homeName  → optional label used only on the home page, so a project can
                 read as "Activity 1" there and "Project 1" in the work index
     category  → drives the filter buttons on projects.html
     gallery   → optional extra photos on the detail page
     learned   → what I got out of it. Not metrics: this is school work, and
                 "99.8% uptime" on a school project is a lie with a decimal point

     « CHECK » Projects 4, 5 and 6 are ones I wrote for you from the skills you
     listed. They are the shape of thing an M5 student who does HTML, CSS, C
     and sensors would plausibly have built. Correct them, or tell me the real
     ones and I will swap them in.
     -------------------------------------------------------------------- */
  const projects = [
    {
      id: 'traffic-light',
      featured: true,
      name: t({ en: 'Project 1', th: 'โปรเจกต์ 1' }),
      homeName: t({ en: 'Activity 1', th: 'กิจกรรม 1' }),
      tagline: t({
        en: 'A traffic light that only bothers changing when someone is there',
        th: 'ไฟจราจรที่จะเปลี่ยนไฟก็ต่อเมื่อมีคนยืนอยู่จริง ๆ'
      }),
      year: '2026',
      role: t({ en: 'Wiring, C, and a lot of tape', th: 'ต่อสาย เขียน C และเทปอีกหลายม้วน' }),
      client: t({ en: 'School project', th: 'งานโรงเรียน' }),
      duration: t({ en: 'A few weeks of afternoons', th: 'ตอนบ่ายของสองสามสัปดาห์' }),
      category: 'hardware',
      tags: t({
        en: ['C', 'Ultrasonic sensor', 'Arduino', 'LEDs'],
        th: ['C', 'เซ็นเซอร์อัลตราโซนิก', 'Arduino', 'LED']
      }),
      cover: 'assets/img/work-traffic.svg',
      coverAlt: t({
        en: 'Drawing of a traffic light beside a distance sensor sending out sonar arcs',
        th: 'ภาพวาดไฟจราจรข้างเซ็นเซอร์วัดระยะที่ส่งคลื่นโซนาร์ออกมา'
      }),
      summary: t({
        en: 'An ultrasonic sensor watches the crossing. If nobody is waiting, ' +
            'the lights leave the traffic alone.',
        th: 'เซ็นเซอร์อัลตราโซนิกคอยดูทางข้าม ถ้าไม่มีใครรออยู่ ไฟก็ปล่อยรถวิ่งไป'
      }),
      problem: t({
        en: 'A normal traffic light runs on a timer and does not care whether ' +
            'anyone is standing there. So you get cars stopped at an empty ' +
            'crossing at ten at night, and everybody learns to ignore the light, ' +
            'which is the worst possible outcome for a traffic light. I wanted ' +
            'one that looks first.',
        th: 'ไฟจราจรปกติทำงานตามเวลา ไม่สนใจว่ามีใครยืนอยู่หรือเปล่า ผลคือรถ ' +
            'ต้องจอดรอที่ทางข้ามที่ไม่มีคนตอนสี่ทุ่ม แล้วทุกคนก็เรียนรู้ที่จะ ' +
            'ไม่สนใจไฟนั้น ซึ่งเป็นผลลัพธ์ที่แย่ที่สุดของไฟจราจร ผมเลยอยากได้ ' +
            'อันที่มองก่อนแล้วค่อยตัดสินใจ'
      }),
      process: t({
        en: [
          'Started with the sensor on its own. Print the distance, wave my hand at it, watch the number move. Nothing else got built until that was boring.',
          'Wired the three LEDs through resistors and got the normal red-amber-green cycle running on a timer, so I had something that worked before I made it clever.',
          'Added the rule: only run the cycle when the sensor sees something inside about a metre for more than a moment. A hand passing by should not stop traffic.',
          'Everything is delays and a state variable rather than one giant loop, so the light is never stuck waiting on the sensor when it should be changing.'
        ],
        th: [
          'เริ่มจากเซ็นเซอร์อย่างเดียวก่อน พิมพ์ระยะออกมา เอามือโบกใส่ ดูตัวเลขขยับ ยังไม่ต่ออย่างอื่นเลยจนกว่าตรงนี้จะน่าเบื่อ',
          'ต่อ LED สามดวงผ่านตัวต้านทาน แล้วทำวงจรไฟ แดง-เหลือง-เขียว ให้วนตามเวลาปกติก่อน เพื่อให้มีของที่ใช้ได้ ก่อนจะไปทำให้มันฉลาด',
          'เพิ่มกติกา ให้เริ่มวนไฟเฉพาะตอนที่เซ็นเซอร์เห็นอะไรอยู่ในระยะราวหนึ่งเมตร นานกว่าแค่แวบเดียว มือที่แกว่งผ่านไม่ควรทำให้รถต้องหยุด',
          'ทั้งหมดใช้ตัวหน่วงเวลากับตัวแปรสถานะ แทนที่จะเขียนเป็นลูปใหญ่อันเดียว ไฟจะได้ไม่ค้างรอเซ็นเซอร์ ในจังหวะที่มันควรจะเปลี่ยน'
        ]
      }),
      learned: t({
        en: [
          'Test one part at a time. The day I wired all of it at once, I had three things that could be broken and no idea which one was.',
          'Sensors lie. Readings jump, and a single bad number should not be allowed to change the lights.',
          'Half of hardware debugging is pushing a wire back in.'
        ],
        th: [
          'ทดสอบทีละส่วน วันที่ผมต่อทุกอย่างพร้อมกัน ผมมีของที่พังได้สามอย่าง และไม่รู้เลยว่าอันไหนพัง',
          'เซ็นเซอร์โกหกได้ ค่ามันกระโดด และค่าที่ผิดค่าเดียวไม่ควรมีสิทธิ์สั่งให้ไฟเปลี่ยน',
          'ครึ่งหนึ่งของการแก้บั๊กฮาร์ดแวร์ คือการเสียบสายกลับเข้าไปใหม่'
        ]
      }),
      tech: t({
        en: ['C', 'Arduino', 'HC-SR04 ultrasonic sensor', 'LEDs and resistors', 'Breadboard'],
        th: ['C', 'Arduino', 'เซ็นเซอร์อัลตราโซนิก HC-SR04', 'LED และตัวต้านทาน', 'เบรดบอร์ด']
      }),
      links: []
    },

    {
      id: 'geoinformatics',
      featured: true,
      name: t({ en: 'Project 2', th: 'โปรเจกต์ 2' }),
      homeName: t({ en: 'Activity 2', th: 'กิจกรรม 2' }),
      tagline: t({
        en: 'A day at KKU working out where in the world a photo was taken',
        th: 'หนึ่งวันที่ ม.ขอนแก่น นั่งเดาว่าภาพนี้ถ่ายที่ไหนบนโลก'
      }),
      year: '2026',
      role: t({ en: 'Competitor, school team', th: 'ผู้เข้าแข่งขัน ทีมโรงเรียน' }),
      client: t({
        en: '4th Computing Fair, College of Computing, Khon Kaen University',
        th: 'งาน 4th Computing Fair วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น'
      }),
      duration: t({ en: 'One day, 17 August 2026', th: 'หนึ่งวัน 17 สิงหาคม 2569' }),
      category: 'competition',
      tags: t({
        en: ['Geoinformatics', 'GeoGuessr', 'Team event'],
        th: ['ภูมิสารสนเทศ', 'GeoGuessr', 'แข่งเป็นทีม']
      }),
      cover: 'assets/img/work-1.jpg',
      coverAlt: t({
        en: 'Everyone who took part in the Geoinformatics Challenge 2026, lined up in front of the event screen',
        th: 'ผู้เข้าร่วมงาน Geoinformatics Challenge 2026 ทั้งหมด ยืนเรียงหน้าจอของงาน'
      }),
      summary: t({
        en: 'Geoinformatics Challenge feat. GeoGuessr. Dropped somewhere on the ' +
            'map with no labels, and you have to argue your way to a country.',
        th: 'Geoinformatics Challenge feat. GeoGuessr โดนหย่อนลงบนแผนที่ ' +
            'ที่ไม่มีป้ายบอกอะไรเลย แล้วต้องเถียงกันจนกว่าจะได้ประเทศ'
      }),
      problem: t({
        en: 'You get a street view and no other information. No place names, no ' +
            'coordinates, nothing helpful. What you do have is which side of the ' +
            'road the cars drive on, the shape of the power poles, the writing on ' +
            'a shop front, the colour of the soil, and the plants. It is ' +
            'geography, except you are reading it off the world instead of a map.',
        th: 'สิ่งที่ได้คือภาพถนน กับไม่มีข้อมูลอย่างอื่นเลย ไม่มีชื่อสถานที่ ' +
            'ไม่มีพิกัด ไม่มีอะไรที่ช่วยได้ สิ่งที่มีคือรถวิ่งเลนไหน รูปทรงเสาไฟ ' +
            'ตัวหนังสือหน้าร้าน สีของดิน และต้นไม้ มันคือวิชาภูมิศาสตร์ ' +
            'แค่อ่านจากโลกจริงแทนที่จะอ่านจากแผนที่'
      }),
      process: t({
        en: [
          'Registered in the morning, got a laptop and a table, and spent the first round finding out how much I did not know.',
          'Learned to look at the boring parts of the picture first. Road markings, bollards, the direction of traffic. The pretty scenery is usually useless.',
          'Argued with my team about a road that turned out to be nowhere near where any of us said.',
          'Finished the rounds, got the certificate, and stayed for the rest of the fair.'
        ],
        th: [
          'ลงทะเบียนตอนเช้า ได้โน้ตบุ๊กกับโต๊ะมาหนึ่งตัว แล้วใช้รอบแรกไปกับการค้นพบว่าตัวเองไม่รู้อะไรบ้าง',
          'เรียนรู้ที่จะดูส่วนที่น่าเบื่อของภาพก่อน เส้นจราจร เสาหลักริมทาง ทิศที่รถวิ่ง วิวสวย ๆ มักจะไม่ได้ช่วยอะไร',
          'เถียงกับเพื่อนในทีมเรื่องถนนเส้นหนึ่ง ที่สุดท้ายอยู่ไกลจากที่ทุกคนเดามาก',
          'แข่งจนครบทุกรอบ ได้เกียรติบัตร แล้วอยู่ต่อจนจบงาน'
        ]
      }),
      learned: t({
        en: [
          'Guessing is a skill and it has rules. People who are good at this are not lucky, they are reading things I had not noticed existed.',
          'Working in a team under a timer is a completely different thing from working alone with time.',
          'Going to a university and seeing what people there actually do is worth more than the placing.'
        ],
        th: [
          'การเดาเป็นทักษะ และมันมีกติกาของมัน คนที่เก่งเรื่องนี้ไม่ได้ดวงดี แต่เขาอ่านสิ่งที่ผมไม่เคยสังเกตว่ามีอยู่',
          'ทำงานเป็นทีมโดยมีเวลาจับ เป็นคนละเรื่องกับทำคนเดียวแบบมีเวลาเหลือ',
          'การได้ไปมหาวิทยาลัย แล้วเห็นว่าคนที่นั่นทำอะไรกันจริง ๆ มีค่ามากกว่าอันดับที่ได้'
        ]
      }),
      tech: t({
        en: ['Geoinformatics', 'GeoGuessr', 'A lot of squinting at road signs'],
        th: ['ภูมิสารสนเทศ', 'GeoGuessr', 'การเพ่งป้ายถนนอย่างหนัก']
      }),
      gallery: [
        {
          src: 'assets/img/work-3.jpg',
          alt: t({
            en: 'Students at the registration desk holding Geoinformatics Challenge signs',
            th: 'นักเรียนที่โต๊ะลงทะเบียน ถือป้าย Geoinformatics Challenge'
          }),
          caption: t({
            en: 'Registration, before anyone knew how hard it was going to be.',
            th: 'ตอนลงทะเบียน ก่อนที่ใครจะรู้ว่ามันจะยากขนาดไหน'
          })
        },
        {
          src: 'assets/img/work-5.jpg',
          alt: t({
            en: 'The competition hall set up and waiting, event slides on both screens',
            th: 'ห้องแข่งที่จัดเสร็จแล้วรออยู่ มีสไลด์ของงานขึ้นทั้งสองจอ'
          }),
          caption: t({
            en: 'The hall at the College of Computing, set up and waiting.',
            th: 'ห้องที่วิทยาลัยการคอมพิวเตอร์ จัดเสร็จแล้วรออยู่'
          })
        },
        {
          src: 'assets/img/work-2.jpg',
          alt: t({
            en: 'Two competitors working a round on one laptop, the street view they are placing on the projector behind them',
            th: 'ผู้เข้าแข่งขันสองคนทำรอบแข่งบนโน้ตบุ๊กเครื่องเดียว ด้านหลังเป็นภาพถนนที่กำลังเดาอยู่'
          }),
          caption: t({
            en: 'A round in progress. The screen behind is what everyone is trying to place.',
            th: 'ระหว่างรอบแข่ง จอด้านหลังคือภาพที่ทุกคนกำลังพยายามเดาว่าอยู่ที่ไหน'
          })
        },
        {
          src: 'assets/img/work-6.jpg',
          alt: t({
            en: 'Competitors and staff gathering at the side of the hall between rounds',
            th: 'ผู้เข้าแข่งขันและทีมงานรวมตัวกันข้างห้อง ระหว่างพักรอบ'
          }),
          caption: t({
            en: 'Fifteen minute break, which is exactly long enough to second-guess your last answer.',
            th: 'พักสิบห้านาที ซึ่งนานพอดีสำหรับการกลับไปสงสัยคำตอบรอบที่แล้วของตัวเอง'
          })
        },
        {
          src: 'assets/img/work-4.jpg',
          alt: t({
            en: 'A participation certificate from the 4th Computing Fair 2026 lying on the desk beside a competition laptop',
            th: 'เกียรติบัตรจากงาน 4th Computing Fair 2026 วางอยู่บนโต๊ะข้างโน้ตบุ๊กที่ใช้แข่ง'
          }),
          caption: t({
            en: 'The certificate, and the laptop that lost me several rounds.',
            th: 'เกียรติบัตร กับโน้ตบุ๊กที่ทำผมแพ้ไปหลายรอบ'
          })
        }
      ],
      links: []
    },

    {
      id: 'this-site',
      featured: true,
      name: t({ en: 'Project 3', th: 'โปรเจกต์ 3' }),
      homeName: t({ en: 'Activity 3', th: 'กิจกรรม 3' }),
      tagline: t({
        en: 'The site you are reading, written by hand',
        th: 'เว็บที่คุณกำลังอ่านอยู่ เขียนเองทั้งหมด'
      }),
      year: '2026',
      role: t({ en: 'All of it', th: 'ทำเองทั้งหมด' }),
      client: t({ en: 'Me', th: 'ตัวเอง' }),
      duration: t({ en: 'Ongoing', th: 'ยังทำอยู่' }),
      category: 'web',
      tags: ['HTML', 'CSS', 'JavaScript'],
      cover: 'assets/img/work-site.svg',
      coverAlt: t({
        en: 'Drawing of a browser window over a grid, with a page being laid out inside it',
        th: 'ภาพวาดหน้าต่างเบราว์เซอร์บนตาราง มีหน้าเว็บกำลังถูกจัดวางอยู่ข้างใน'
      }),
      summary: t({
        en: 'Five pages of hand-written HTML, CSS and JavaScript. No framework, ' +
            'no build step, no 300 packages to draw a button.',
        th: 'ห้าหน้า เขียน HTML, CSS และ JavaScript เองทั้งหมด ไม่มีเฟรมเวิร์ก ' +
            'ไม่มีขั้นตอน build ไม่ต้องลง 300 แพ็กเกจเพื่อวาดปุ่มหนึ่งปุ่ม'
      }),
      problem: t({
        en: 'I wanted somewhere to put my work that was not a social media post ' +
            'that disappears down a feed in a day. And I wanted to build it ' +
            'rather than fill in a template, because filling in a template ' +
            'teaches you nothing except where that template put the buttons.',
        th: 'ผมอยากมีที่เก็บผลงาน ที่ไม่ใช่โพสต์บนโซเชียลที่หายลงไปในฟีดภายในวันเดียว ' +
            'และผมอยากสร้างมันเอง มากกว่าจะไปกรอกเทมเพลต เพราะการกรอกเทมเพลต ' +
            'ไม่ได้สอนอะไรเลย นอกจากว่าเทมเพลตนั้นวางปุ่มไว้ตรงไหน'
      }),
      process: t({
        en: [
          'Every word on the site lives in one file, data.js. Change your name there and all five pages change, instead of me editing the same thing in five places and missing one.',
          'Plain HTML, CSS and JavaScript. Open any file and what is in it is what runs. No build step to learn before I can fix a typo.',
          'Layout is CSS Grid and Flexbox, so it reshapes for a phone instead of having a separate mobile version to keep in sync.',
          'One Three.js scene in the hero because I wanted to see if I could, and a Spring Boot endpoint behind the contact form for the same reason.'
        ],
        th: [
          'ทุกคำบนเว็บอยู่ในไฟล์เดียว คือ data.js แก้ชื่อที่นั่นทีเดียว ทั้งห้าหน้าเปลี่ยนตาม แทนที่จะต้องไล่แก้ที่เดียวกันห้าที่ แล้วลืมไปหนึ่งที่',
          'HTML, CSS และ JavaScript เปล่า ๆ เปิดไฟล์ไหนขึ้นมา สิ่งที่อยู่ในนั้นคือสิ่งที่รันจริง ไม่ต้องไปเรียนขั้นตอน build ก่อนจะแก้คำผิดได้',
          'จัดหน้าด้วย CSS Grid กับ Flexbox มันเลยปรับตัวเองให้เข้ากับมือถือ แทนที่จะมีเวอร์ชันมือถือแยกอีกอันให้ต้องคอยตามแก้',
          'มีฉาก Three.js หนึ่งฉากในหน้าแรก เพราะอยากรู้ว่าทำได้ไหม และมี Spring Boot อยู่หลังฟอร์มติดต่อ ด้วยเหตุผลเดียวกัน'
        ]
      }),
      learned: t({
        en: [
          'Putting the content in one place instead of five was the single best decision in the whole thing.',
          'CSS is much less frightening once you stop guessing and start reading what a property actually does.',
          'Writing it by hand is slower at the start and much faster the moment something breaks, because I know where everything is.'
        ],
        th: [
          'การเอาเนื้อหาไปไว้ที่เดียว แทนที่จะกระจายอยู่ห้าที่ คือการตัดสินใจที่ดีที่สุดของงานนี้',
          'CSS น่ากลัวน้อยลงเยอะ ตอนที่เลิกเดา แล้วเริ่มอ่านว่าแต่ละ property มันทำอะไรจริง ๆ',
          'เขียนเองช้ากว่าตอนเริ่ม แต่เร็วกว่ามากตอนที่มีอะไรพัง เพราะผมรู้ว่าทุกอย่างอยู่ตรงไหน'
        ]
      }),
      tech: ['HTML', 'CSS', 'JavaScript', 'anime.js', 'Three.js', 'Java', 'Spring Boot'],
      links: [{
        label: t({ en: 'Source', th: 'ซอร์สโค้ด' }),
        href: 'https://github.com/' + identity.handle + '/' + identity.handle + '.github.io'
      }]
    },

    {
      id: 'timetable',
      featured: false,
      name: t({ en: 'Project 4', th: 'โปรเจกต์ 4' }),
      tagline: t({
        en: 'A timetable page, so nobody has to ask which room again',
        th: 'หน้าตารางเรียน จะได้ไม่มีใครต้องถามว่าคาบนี้ห้องไหนอีก'
      }),
      year: '2025',
      role: t({ en: 'HTML, CSS, and asking people what they wanted', th: 'HTML, CSS และไปถามคนอื่นว่าอยากได้อะไร' }),
      client: t({ en: 'My class', th: 'ห้องเรียนของผม' }),
      duration: t({ en: 'A weekend, then small fixes for a month', th: 'หนึ่งสุดสัปดาห์ แล้วตามแก้เล็ก ๆ อีกเดือน' }),
      category: 'web',
      tags: ['HTML', 'CSS'],
      cover: 'assets/img/work-timetable.svg',
      coverAlt: t({
        en: 'Drawing of a weekly timetable grid with one column highlighted',
        th: 'ภาพวาดตารางเรียนรายสัปดาห์ โดยมีหนึ่งคอลัมน์ถูกเน้นไว้'
      }),
      summary: t({
        en: 'The class timetable as one page that opens on a phone, instead of ' +
            'a photo of a photo of a printout.',
        th: 'ตารางเรียนของห้อง ทำเป็นหน้าเว็บหน้าเดียวที่เปิดบนมือถือได้ ' +
            'แทนที่จะเป็นรูปถ่ายของรูปถ่ายของกระดาษที่ปรินต์มา'
      }),
      problem: t({
        en: 'The timetable lived as a photo somebody took of the printed sheet ' +
            'on the wall, forwarded around until it was unreadable. Every ' +
            'morning somebody asked which room. It is the same information every ' +
            'week and it should not be that hard to look at.',
        th: 'ตารางเรียนอยู่ในรูปแบบภาพถ่ายที่ใครสักคนถ่ายกระดาษที่ติดผนังไว้ ' +
            'แล้วส่งต่อกันไปเรื่อย ๆ จนอ่านไม่ออก ทุกเช้าจะมีคนถามว่าคาบนี้ห้องไหน ' +
            'มันคือข้อมูลเดิมทุกสัปดาห์ และมันไม่ควรจะดูยากขนาดนั้น'
      }),
      process: t({
        en: [
          'Typed the whole timetable out once as a plain HTML table. Boring, and it is the reason everything after this was easy.',
          'CSS Grid for the week view on a laptop. On a phone it collapses to one day at a time, because nobody scrolls sideways to read a table.',
          'Today\'s column is highlighted, so the answer to the question people actually ask is the first thing you see.',
          'No JavaScript at all. It is a table of text that changes twice a year, and a page that cannot break is worth more than a page that is clever.'
        ],
        th: [
          'พิมพ์ตารางทั้งหมดออกมาเป็นตาราง HTML ธรรมดาก่อนหนึ่งรอบ น่าเบื่อ และเป็นเหตุผลที่ทุกอย่างหลังจากนั้นง่ายไปหมด',
          'ใช้ CSS Grid สำหรับมุมมองรายสัปดาห์บนโน้ตบุ๊ก ส่วนบนมือถือจะยุบเหลือทีละวัน เพราะไม่มีใครเลื่อนจอไปทางข้างเพื่ออ่านตาราง',
          'คอลัมน์ของวันนี้จะถูกเน้นไว้ คำตอบของคำถามที่คนถามจริง ๆ เลยเป็นสิ่งแรกที่เห็น',
          'ไม่มี JavaScript เลยสักบรรทัด มันคือตารางตัวอักษรที่เปลี่ยนปีละสองครั้ง และหน้าที่พังไม่ได้ มีค่ามากกว่าหน้าที่ฉลาด'
        ]
      }),
      learned: t({
        en: [
          'Ask the people who will use it what they actually look for. Everyone said "which room", nobody said "the whole week".',
          'A table is the right element for a table. I tried to be clever with divs first and it read worse and announced worse.',
          'The version with no JavaScript is still working now, months later, without me touching it.'
        ],
        th: [
          'ไปถามคนที่จะใช้จริงว่าเขาหาอะไร ทุกคนตอบว่า "ห้องไหน" ไม่มีใครตอบว่า "ทั้งสัปดาห์"',
          'ตารางควรใช้แท็กตาราง ตอนแรกผมพยายามฉลาดด้วย div แล้วมันทั้งอ่านยากกว่า และโปรแกรมอ่านหน้าจอก็อ่านออกมาแย่กว่า',
          'เวอร์ชันที่ไม่มี JavaScript ยังทำงานอยู่จนถึงตอนนี้ ผ่านมาหลายเดือน โดยที่ผมไม่ต้องไปแตะมันเลย'
        ]
      }),
      tech: t({
        en: ['HTML', 'CSS Grid', 'No JavaScript'],
        th: ['HTML', 'CSS Grid', 'ไม่มี JavaScript']
      }),
      links: []
    },

    {
      id: 'room-monitor',
      featured: false,
      name: t({ en: 'Project 5', th: 'โปรเจกต์ 5' }),
      tagline: t({
        en: 'A sensor that settles an argument about how hot the room is',
        th: 'เซ็นเซอร์ที่เอาไว้ตัดสินว่าห้องนี้ร้อนจริงหรือคิดไปเอง'
      }),
      year: '2025',
      role: t({ en: 'C, wiring, and reading a datasheet properly', th: 'เขียน C ต่อสาย และอ่านดาต้าชีตให้จบ' }),
      client: t({ en: 'The classroom at the end of the corridor', th: 'ห้องเรียนสุดทางเดิน' }),
      duration: t({ en: 'Three weeks', th: 'สามสัปดาห์' }),
      category: 'hardware',
      tags: t({
        en: ['C', 'DHT11', 'Arduino', 'LCD'],
        th: ['C', 'DHT11', 'Arduino', 'จอ LCD']
      }),
      cover: 'assets/img/work-monitor.svg',
      coverAlt: t({
        en: 'Drawing of a small display showing temperature and humidity, wired to a sensor',
        th: 'ภาพวาดจอเล็ก ๆ แสดงอุณหภูมิและความชื้น ต่อสายอยู่กับเซ็นเซอร์'
      }),
      summary: t({
        en: 'Temperature and humidity on a small screen, updated every few ' +
            'seconds, so the answer is a number instead of an opinion.',
        th: 'อุณหภูมิกับความชื้นบนจอเล็ก ๆ อัปเดตทุกไม่กี่วินาที คำตอบจะได้ ' +
            'เป็นตัวเลข ไม่ใช่ความรู้สึก'
      }),
      problem: t({
        en: 'One room in our building is hotter than the others and everybody ' +
            'has a theory about why. Nobody had a number. A thermometer on the ' +
            'wall answers it once; something that reads every few seconds and ' +
            'shows it on a screen answers it all day.',
        th: 'มีห้องหนึ่งในตึกที่ร้อนกว่าห้องอื่น และทุกคนมีทฤษฎีของตัวเองว่าทำไม ' +
            'แต่ไม่มีใครมีตัวเลข เทอร์โมมิเตอร์ติดผนังตอบได้ครั้งเดียว ' +
            'ส่วนของที่อ่านค่าทุกไม่กี่วินาทีแล้วขึ้นจอ ตอบได้ทั้งวัน'
      }),
      process: t({
        en: [
          'Read the sensor on its own first and printed the values over serial, the same way I started the traffic light. It is the only way I trust anything afterwards.',
          'The DHT11 wants a gap between readings and returns nonsense if you rush it. That is in the datasheet, which I found out after an afternoon of blaming my wiring.',
          'Averaged the last few readings before showing them, so the display is not flickering between two numbers that are a tenth of a degree apart.',
          'Put it on a 16x2 LCD rather than a computer, so it works with nothing plugged into it except power.'
        ],
        th: [
          'อ่านค่าจากเซ็นเซอร์อย่างเดียวก่อน แล้วพิมพ์ออกทาง serial แบบเดียวกับตอนเริ่มทำไฟจราจร เป็นวิธีเดียวที่ทำให้ผมเชื่อทุกอย่างที่ตามมาทีหลังได้',
          'DHT11 ต้องการเวลาห่างระหว่างการอ่านแต่ละครั้ง ถ้ารีบมันจะคืนค่ามั่ว ๆ มา เรื่องนี้อยู่ในดาต้าชีต ซึ่งผมไปเจอหลังจากนั่งโทษสายไฟตัวเองมาทั้งบ่าย',
          'เฉลี่ยค่าที่อ่านได้ล่าสุดสองสามค่าก่อนแสดงผล จอจะได้ไม่กระพริบสลับไปมาระหว่างตัวเลขที่ต่างกันแค่หนึ่งในสิบองศา',
          'เอาไปแสดงบนจอ LCD 16x2 แทนที่จะต่อคอมพิวเตอร์ มันจะได้ทำงานได้โดยไม่ต้องเสียบอะไรเลยนอกจากไฟ'
        ]
      }),
      learned: t({
        en: [
          'Read the datasheet before you blame the wiring. It would have saved me an afternoon.',
          'A raw sensor reading is not a measurement yet. Averaging is the difference between a number and a flicker.',
          'People believe a screen on the wall in a way they do not believe you telling them the same thing.'
        ],
        th: [
          'อ่านดาต้าชีตก่อนจะไปโทษสายไฟ ถ้าทำแบบนั้นผมคงประหยัดไปได้ทั้งบ่าย',
          'ค่าดิบจากเซ็นเซอร์ยังไม่นับเป็นค่าที่วัดได้ การเฉลี่ยคือเส้นแบ่งระหว่างตัวเลข กับแสงที่กระพริบไปมา',
          'คนเชื่อจอที่ติดอยู่บนผนัง ในแบบที่เขาไม่เชื่อเราตอนเราบอกเรื่องเดียวกัน'
        ]
      }),
      tech: t({
        en: ['C', 'Arduino', 'DHT11 temperature and humidity sensor', '16x2 LCD', 'Breadboard'],
        th: ['C', 'Arduino', 'เซ็นเซอร์อุณหภูมิและความชื้น DHT11', 'จอ LCD 16x2', 'เบรดบอร์ด']
      }),
      links: []
    },

    {
      id: 'line-robot',
      featured: false,
      name: t({ en: 'Project 6', th: 'โปรเจกต์ 6' }),
      tagline: t({
        en: 'A robot that follows a line, eventually, most of the time',
        th: 'หุ่นยนต์เดินตามเส้น ที่สุดท้ายก็ทำได้ เกือบทุกครั้ง'
      }),
      year: '2025',
      role: t({ en: 'C, motors, and a lot of tape on the floor', th: 'เขียน C ต่อมอเตอร์ และแปะเทปเต็มพื้น' }),
      client: t({ en: 'Robotics club', th: 'ชุมนุมหุ่นยนต์' }),
      duration: t({ en: 'Most of a term', th: 'เกือบทั้งเทอม' }),
      category: 'hardware',
      tags: t({
        en: ['C', 'IR sensors', 'Motors', 'Arduino'],
        th: ['C', 'เซ็นเซอร์อินฟราเรด', 'มอเตอร์', 'Arduino']
      }),
      cover: 'assets/img/work-robot.svg',
      coverAlt: t({
        en: 'Drawing of a two-wheeled robot on a curving black line, with sensor beams pointing down',
        th: 'ภาพวาดหุ่นยนต์สองล้อบนเส้นสีดำที่โค้งไปมา มีลำแสงเซ็นเซอร์ชี้ลงพื้น'
      }),
      summary: t({
        en: 'Two motors, two infrared sensors and a strip of electrical tape. ' +
            'Most of the work was in what it does when it loses the line.',
        th: 'มอเตอร์สองตัว เซ็นเซอร์อินฟราเรดสองตัว กับเทปพันสายไฟหนึ่งม้วน ' +
            'งานส่วนใหญ่อยู่ตรงที่ว่ามันจะทำอะไร ตอนที่มันหาเส้นไม่เจอ'
      }),
      problem: t({
        en: 'Following a straight line is the easy half and it works in an ' +
            'afternoon. The corners are the real problem. The robot arrives at a ' +
            'bend faster than it can turn, overshoots, and then it is a robot ' +
            'sitting on a white floor with no idea where the line went.',
        th: 'การเดินตามเส้นตรงคือครึ่งที่ง่าย และทำเสร็จได้ในบ่ายเดียว ' +
            'ปัญหาจริงอยู่ที่ทางโค้ง หุ่นวิ่งมาถึงโค้งเร็วกว่าที่มันจะเลี้ยวทัน ' +
            'มันเลยเลยออกไป แล้วก็กลายเป็นหุ่นยนต์ที่นั่งอยู่บนพื้นสีขาว ' +
            'โดยไม่รู้ว่าเส้นหายไปไหน'
      }),
      process: t({
        en: [
          'Calibrated the sensors on the actual floor we run on, not on a desk. Black tape on our tiles reads differently from black tape anywhere else.',
          'Started with the crude version: one sensor sees black, that wheel slows down. It wobbles down a straight line but it proves the wiring.',
          'Slowed the whole robot down. Half the cornering problem was that it was simply going faster than it could think.',
          'Added a memory of which side the line was on last, so when both sensors see white it turns back the way it came instead of driving off.'
        ],
        th: [
          'ปรับค่าเซ็นเซอร์บนพื้นที่ใช้วิ่งจริง ไม่ใช่บนโต๊ะ เทปดำบนกระเบื้องของเรา ให้ค่าไม่เหมือนเทปดำบนพื้นที่อื่น',
          'เริ่มจากเวอร์ชันหยาบ ๆ ก่อน เซ็นเซอร์ข้างไหนเห็นสีดำ ล้อข้างนั้นก็ช้าลง มันส่ายไปมาบนเส้นตรง แต่พิสูจน์ว่าสายไฟถูกแล้ว',
          'ลดความเร็วหุ่นลงทั้งตัว ครึ่งหนึ่งของปัญหาทางโค้ง คือมันวิ่งเร็วกว่าที่มันคิดทัน เฉย ๆ',
          'เพิ่มความจำว่าเส้นอยู่ข้างไหนเป็นครั้งสุดท้าย พอเซ็นเซอร์เห็นสีขาวทั้งสองตัว มันจะเลี้ยวกลับไปทางเดิม แทนที่จะวิ่งหลุดออกไป'
        ]
      }),
      learned: t({
        en: [
          'Slowing down fixed more than any code I wrote. Not every problem is a logic problem.',
          'Calibrate where it runs. A value that works on the club table is not a value that works on the corridor floor.',
          'Deciding what to do when the input is missing is most of the job, in hardware and everywhere else.'
        ],
        th: [
          'การลดความเร็วลง แก้ปัญหาได้มากกว่าโค้ดทุกบรรทัดที่ผมเขียน ไม่ใช่ทุกปัญหาจะเป็นปัญหาเรื่องตรรกะ',
          'ปรับค่าตรงที่มันวิ่งจริง ค่าที่ใช้ได้บนโต๊ะชุมนุม ไม่ใช่ค่าที่ใช้ได้บนพื้นทางเดิน',
          'การตัดสินใจว่าจะทำอะไรตอนที่ข้อมูลขาดหายไป คืองานส่วนใหญ่ ทั้งในฮาร์ดแวร์และในทุกเรื่อง'
        ]
      }),
      tech: t({
        en: ['C', 'Arduino', 'IR reflectance sensors', 'DC motors and driver', 'Electrical tape'],
        th: ['C', 'Arduino', 'เซ็นเซอร์สะท้อนอินฟราเรด', 'มอเตอร์กระแสตรงและไดรเวอร์', 'เทปพันสายไฟ']
      }),
      links: []
    }
  ];

  /* ---------- 7. Filter labels ------------------------------------------- */
  const categories = t({
    en: { 'all': 'everything', 'hardware': 'hardware', 'web': 'web', 'competition': 'competitions' },
    th: { 'all': 'ทั้งหมด', 'hardware': 'ฮาร์ดแวร์', 'web': 'เว็บ', 'competition': 'การแข่งขัน' }
  });

  /* ---------- 8. Helpers used by the page scripts ------------------------ */
  return {
    identity, socials, timeline, skills, stack, projects, categories,

    /** Projects flagged featured - the home page shows three. */
    featured(limit = 3) {
      return projects.filter(p => p.featured).slice(0, limit);
    },

    /** Look up a project from the ?id= query string. */
    byId(id) {
      return projects.find(p => p.id === id) || null;
    },

    /** Position in the list, used for prev/next. */
    indexOf(id) {
      return projects.findIndex(p => p.id === id);
    },

    /** Neighbours, wrapping around, so the pager is never a dead end. */
    neighbours(id) {
      const i = projects.findIndex(p => p.id === id);
      if (i < 0 || projects.length < 2) return { prev: null, next: null };
      return {
        prev: projects[(i - 1 + projects.length) % projects.length],
        next: projects[(i + 1) % projects.length]
      };
    }
  };
})();
