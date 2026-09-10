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
      year: t({ en: '2026', th: '2569' }),
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
      year: t({ en: '2025', th: '2568' }),
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
      year: t({ en: '2024', th: '2567' }),
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
      year: t({ en: '2023', th: '2566' }),
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

     Projects 4, 5 and 6 are the three certificates: the Dobot workshop at Loei
     Rajabhat, the Free Fire tournament, and the gold medal with the Pong Lang
     band. The organisation, the event, the award and the date on each of them
     are read off the certificate itself. The « what I did » and « what I
     learned » lists under each one are written from what that kind of day
     involves, not from a transcript - « CHECK » those and make them yours.
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
      year: t({ en: '2026', th: '2569' }),
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
      year: t({ en: '2026', th: '2569' }),
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
      year: t({ en: '2026', th: '2569' }),
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
      id: 'dobot',
      featured: false,
      name: t({ en: 'Project 4', th: 'โปรเจกต์ 4' }),
      tagline: t({
        en: 'A day with a robot arm that does exactly what you said',
        th: 'หนึ่งวันกับแขนกล ที่ทำตามที่เราสั่งเป๊ะ ๆ'
      }),
      year: t({ en: '2025', th: '2568' }),
      role: t({ en: 'Trainee', th: 'ผู้เข้าอบรม' }),
      client: t({
        en: 'Faculty of Industrial Technology, Loei Rajabhat University',
        th: 'คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏเลย'
      }),
      duration: t({ en: 'One day, 13 August 2025', th: 'หนึ่งวัน 13 สิงหาคม 2568' }),
      category: 'training',
      tags: t({
        en: ['Dobot Magician', 'Robotics', 'Automation'],
        th: ['Dobot Magician', 'หุ่นยนต์', 'ระบบอัตโนมัติ']
      }),
      cover: 'assets/img/cert-dobot.jpg',
      coverAlt: t({
        en: 'Certificate from the Faculty of Industrial Technology, Loei Rajabhat University, for a Dobot Magician robotic arm and automation workshop',
        th: 'เกียรติบัตรจากคณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏเลย สำหรับการอบรมหุ่นยนต์แขนกล Dobot Magician และระบบอัตโนมัติ'
      }),
      summary: t({
        en: 'A hands-on workshop on the Dobot Magician robotic arm and automation ' +
            'control, run for schools around Loei.',
        th: 'การอบรมเชิงปฏิบัติการเรื่องหุ่นยนต์แขนกล Dobot Magician และการควบคุม ' +
            'ระบบอัตโนมัติ จัดให้โรงเรียนในจังหวัดเลยและพื้นที่ใกล้เคียง'
      }),
      problem: t({
        en: 'Everything I had made move until then was a light or a wheel. A robot ' +
            'arm has to end up at a point in actual space, and it has no idea what ' +
            'is in the way. Getting it there is not the hard part. Getting it there ' +
            'without hitting the thing next to it, over and over, is.',
        th: 'ก่อนหน้านั้น ทุกอย่างที่ผมเคยทำให้ขยับได้คือหลอดไฟกับล้อ แต่แขนกล ' +
            'ต้องไปหยุดที่จุดหนึ่งในพื้นที่จริง และมันไม่รู้เลยว่ามีอะไรขวางอยู่ ' +
            'การพามันไปถึงไม่ใช่เรื่องยาก การพาไปถึงโดยไม่ชนของที่วางอยู่ข้าง ๆ ' +
            'ซ้ำแล้วซ้ำอีก ต่างหากที่ยาก'
      }),
      process: t({
        en: [
          'Jogged the arm by hand first and saved the positions, rather than typing coordinates and hoping. Seeing where it actually stops is the whole point of it being in front of you.',
          'Chained the saved points into a sequence and ran it. The first run knocked something over, which is how you find out your route is not the route you pictured.',
          'Added the gripper, which turns one position into two: where you close it, and where you open it again.',
          'Watched the same programme run twenty times without drifting. That repeatability is the thing an arm is for, and it is not obvious until you see it.'
        ],
        th: [
          'ลองจับแขนกลขยับด้วยมือแล้วบันทึกตำแหน่งไว้ก่อน แทนที่จะพิมพ์พิกัดแล้วภาวนา การได้เห็นว่ามันหยุดตรงไหนจริง ๆ คือเหตุผลที่มันมาตั้งอยู่ตรงหน้าเรา',
          'ต่อจุดที่บันทึกไว้เป็นลำดับแล้วสั่งรัน รอบแรกมันปัดของล้ม ซึ่งเป็นวิธีที่ทำให้รู้ว่าเส้นทางที่คิดไว้ในหัว ไม่ใช่เส้นทางที่มันเดินจริง',
          'ใส่หัวจับเข้าไป ซึ่งเปลี่ยนหนึ่งตำแหน่งให้กลายเป็นสองตำแหน่ง คือจุดที่หนีบ กับจุดที่ปล่อย',
          'นั่งดูโปรแกรมเดิมรันซ้ำยี่สิบรอบโดยไม่เพี้ยน ความแม่นซ้ำแบบนี้คือเหตุผลที่แขนกลมีอยู่ และไม่มีทางรู้สึกได้จนกว่าจะเห็นกับตา'
        ]
      }),
      learned: t({
        en: [
          'A machine that moves in the real world fails differently from code. There is no undo, and the mistake makes a noise.',
          'Teaching positions by hand beats calculating them, at least until you understand what the numbers mean.',
          'Automation is mostly deciding the order of things, and only a little about the robot.'
        ],
        th: [
          'เครื่องจักรที่ขยับในโลกจริงพังคนละแบบกับโค้ด มันไม่มีปุ่มย้อนกลับ และตอนพลาดมันมีเสียงด้วย',
          'การสอนตำแหน่งด้วยมือดีกว่าการคำนวณเอา อย่างน้อยก็จนกว่าจะเข้าใจว่าตัวเลขพวกนั้นหมายถึงอะไร',
          'ระบบอัตโนมัติส่วนใหญ่คือการตัดสินใจว่าจะทำอะไรก่อนหลัง ส่วนเรื่องตัวหุ่นยนต์เป็นแค่ส่วนเล็ก ๆ'
        ]
      }),
      tech: t({
        en: ['Dobot Magician', 'Teach-and-repeat positioning', 'Gripper end effector', 'Automation sequencing'],
        th: ['Dobot Magician', 'การสอนตำแหน่งแล้วสั่งทำซ้ำ', 'หัวจับปลายแขน', 'การเรียงลำดับงานอัตโนมัติ']
      }),
      links: []
    },

    {
      id: 'freefire',
      featured: false,
      name: t({ en: 'Project 5', th: 'โปรเจกต์ 5' }),
      tagline: t({
        en: 'Four against four, and the part nobody practises is talking',
        th: 'สี่ต่อสี่ และสิ่งที่ไม่มีใครซ้อมคือการพูดกัน'
      }),
      year: t({ en: '2025', th: '2568' }),
      role: t({ en: 'Player', th: 'ผู้เล่น' }),
      client: t({
        en: 'Computer Science, Faculty of Science and Technology, Loei Rajabhat University',
        th: 'สาขาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏเลย'
      }),
      duration: t({ en: 'One day, 26 July 2025', th: 'หนึ่งวัน 26 กรกฎาคม 2568' }),
      category: 'competition',
      tags: t({
        en: ['E-sport', 'Free Fire', 'Team of four'],
        th: ['อีสปอร์ต', 'Free Fire', 'ทีมสี่คน']
      }),
      cover: 'assets/img/cert-freefire.jpg',
      coverAlt: t({
        en: 'Certificate for taking part in the Free Fire 4v4 tournament at Loei Rajabhat University',
        th: 'เกียรติบัตรการเข้าร่วมการแข่งขัน Free Fire 4v4 ที่มหาวิทยาลัยราชภัฏเลย'
      }),
      summary: t({
        en: 'The university e-sport tournament. Four of us, one bracket, and a ' +
            'lesson about teams that had nothing to do with the game.',
        th: 'การแข่งอีสปอร์ตของมหาวิทยาลัย พวกเราสี่คน หนึ่งสายการแข่ง ' +
            'และบทเรียนเรื่องการทำงานเป็นทีมที่ไม่เกี่ยวกับเกมเลย'
      }),
      problem: t({
        en: 'Four people who are each fine on their own are not a team. In a 4v4 ' +
            'you lose rounds you should have won because two of you went for the ' +
            'same thing and nobody covered the other side. The game is the easy ' +
            'part. Agreeing on a plan in the ten seconds before it starts is not.',
        th: 'คนสี่คนที่เก่งของตัวเองคนละคน ยังไม่นับว่าเป็นทีม ในโหมด 4v4 ' +
            'เราแพ้รอบที่ควรจะชนะ เพราะสองคนไปทางเดียวกัน แล้วไม่มีใครดูอีกฝั่ง ' +
            'ตัวเกมคือส่วนที่ง่าย การตกลงแผนกันให้ได้ในสิบวินาทีก่อนเริ่ม ต่างหากที่ยาก'
      }),
      process: t({
        en: [
          'Signed up as a team of four and worked out our roles before the bracket started, rather than during it.',
          'Agreed to call things out in short words. Long sentences arrive after the thing they were about.',
          'Lost a round, talked about what actually happened instead of who did it, and went again.',
          'Played the bracket out to the end. We did not win it, and the certificate says participation, which is what it was.'
        ],
        th: [
          'สมัครเป็นทีมสี่คน แล้วตกลงหน้าที่กันให้จบก่อนสายการแข่งจะเริ่ม ไม่ใช่ระหว่างแข่ง',
          'ตกลงกันว่าจะสื่อสารด้วยคำสั้น ๆ ประโยคยาว ๆ มักมาถึงหลังจากเรื่องที่จะบอกจบไปแล้ว',
          'แพ้ไปหนึ่งรอบ แล้วคุยกันว่าเกิดอะไรขึ้นจริง ๆ แทนที่จะคุยว่าใครทำ แล้วก็ลงไปใหม่',
          'เล่นจนจบสาย เราไม่ได้ชนะ และเกียรติบัตรเขียนว่าเข้าร่วม ซึ่งก็ตรงตามนั้น'
        ]
      }),
      learned: t({
        en: [
          'Say the short thing now, not the accurate thing in five seconds.',
          'Reviewing a loss works when you talk about the situation and not the person. That is not a games thing, it turns out.',
          'Practising alone and playing together are two different skills, and I had only been doing one of them.'
        ],
        th: [
          'พูดสั้น ๆ ตอนนี้ ดีกว่าพูดให้ครบถ้วนในอีกห้าวินาที',
          'การมานั่งทบทวนตอนแพ้จะได้ผล ถ้าคุยกันที่สถานการณ์ ไม่ใช่ที่ตัวคน ซึ่งกลายเป็นว่าไม่ใช่เรื่องของเกมอย่างเดียว',
          'การซ้อมคนเดียวกับการเล่นด้วยกัน เป็นคนละทักษะ และผมทำอยู่แค่อย่างเดียวมาตลอด'
        ]
      }),
      tech: t({
        en: ['Free Fire', '4v4 format', 'Voice comms', 'Four people who had to agree'],
        th: ['Free Fire', 'รูปแบบ 4v4', 'การสื่อสารด้วยเสียง', 'คนสี่คนที่ต้องตกลงกันให้ได้']
      }),
      links: []
    },

    {
      id: 'ponglang',
      featured: false,
      name: t({ en: 'Project 6', th: 'โปรเจกต์ 6' }),
      tagline: t({
        en: 'Gold medal, first runner-up, with the school folk band',
        th: 'เหรียญทอง รองชนะเลิศอันดับ 1 กับวงดนตรีพื้นเมืองของโรงเรียน'
      }),
      year: t({ en: '2026', th: '2569' }),
      role: t({ en: 'Band member', th: 'สมาชิกวง' }),
      client: t({
        en: 'Secondary Educational Service Area Office, Loei and Nong Bua Lamphu',
        th: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาเลย หนองบัวลำภู'
      }),
      duration: t({
        en: '22-23 and 26 January 2026',
        th: '22-23 และ 26 มกราคม 2569'
      }),
      category: 'competition',
      tags: t({
        en: ['Pong Lang', 'Isan folk music', 'Gold medal'],
        th: ['โปงลาง', 'ดนตรีพื้นเมืองอีสาน', 'เหรียญทอง']
      }),
      cover: 'assets/img/cert-ponglang.jpg',
      coverAlt: t({
        en: 'Certificate for a gold medal, first runner-up, in the Pong Lang folk band competition at the 73rd Student Arts and Crafts Festival',
        th: 'เกียรติบัตรรางวัลเหรียญทอง รองชนะเลิศอันดับ 1 การแข่งขันวงดนตรีพื้นเมืองโปงลาง งานศิลปหัตถกรรมนักเรียน ครั้งที่ 73'
      }),
      summary: t({
        en: 'The 73rd Student Arts and Crafts Festival, Pong Lang folk band, ' +
            'M1 to M6. Gold medal and first runner-up.',
        th: 'งานศิลปหัตถกรรมนักเรียน ครั้งที่ 73 การแข่งขันวงดนตรีพื้นเมืองโปงลาง ' +
            'ระดับชั้น ม.1-ม.6 ได้รางวัลเหรียญทอง รองชนะเลิศอันดับ 1'
      }),
      problem: t({
        en: 'This one is not a computer. A Pong Lang band is a lot of people ' +
            'playing loud instruments at the same time, and it only sounds like ' +
            'one thing if everybody is exactly together. One person half a beat ' +
            'out is audible from the back of the hall.',
        th: 'อันนี้ไม่ใช่คอมพิวเตอร์ วงโปงลางคือคนจำนวนมากเล่นเครื่องดนตรีเสียงดัง ' +
            'พร้อมกัน และมันจะฟังเป็นเสียงเดียวกันก็ต่อเมื่อทุกคนตรงกันเป๊ะ ' +
            'คนเดียวที่ช้าไปครึ่งจังหวะ ได้ยินถึงหลังห้องประชุม'
      }),
      process: t({
        en: [
          'Rehearsed after school, over and over, on the same few bars until they stopped being the ones that fell apart.',
          'Learned my part well enough to stop reading it, because you cannot listen to the person next to you while you are still counting.',
          'Played it through at the district round in January, in front of judges and a hall.',
          'Gold medal, first runner-up. One place off, which is close enough to still think about.'
        ],
        th: [
          'ซ้อมหลังเลิกเรียน วนแล้ววนอีก อยู่กับท่อนเดิมไม่กี่ท่อน จนกว่ามันจะเลิกเป็นท่อนที่พังทุกรอบ',
          'จำท่อนของตัวเองให้ได้จนไม่ต้องอ่านโน้ต เพราะเราฟังคนข้าง ๆ ไม่ได้ ถ้ายังต้องนับจังหวะอยู่',
          'ขึ้นเล่นจริงในรอบเขตพื้นที่เดือนมกราคม ต่อหน้ากรรมการและคนทั้งห้อง',
          'ได้เหรียญทอง รองชนะเลิศอันดับ 1 ห่างอีกอันดับเดียว ซึ่งใกล้พอที่จะยังคิดถึงมันอยู่'
        ]
      }),
      learned: t({
        en: [
          'Being together matters more than being good. A band that is tight and simple beats a band that is clever and ragged.',
          'You cannot listen while you are still counting. Knowing your own part is what buys you the attention to hear everybody else.',
          'It is the same lesson as the Free Fire bracket, in a completely different room, which is probably how I know it is a real one.'
        ],
        th: [
          'ความพร้อมเพรียงสำคัญกว่าความเก่ง วงที่แน่นและเรียบง่าย ชนะวงที่พลิ้วแต่ไม่ตรงกัน',
          'เราฟังคนอื่นไม่ได้ถ้ายังนับจังหวะอยู่ การจำท่อนตัวเองให้ได้ คือสิ่งที่ซื้อสมาธิมาให้เราได้ยินคนอื่น',
          'มันคือบทเรียนเดียวกับตอนแข่ง Free Fire แค่คนละห้อง คนละเรื่องกันเลย ซึ่งน่าจะเป็นเหตุผลที่ผมรู้ว่ามันเป็นเรื่องจริง'
        ]
      }),
      tech: t({
        en: ['Pong Lang', 'Isan folk ensemble', 'Rehearsal, mostly'],
        th: ['โปงลาง', 'วงดนตรีพื้นเมืองอีสาน', 'การซ้อม เป็นหลัก']
      }),
      links: []
    }
  ];

  /* ---------- 7. Filter labels ------------------------------------------- */
  const categories = t({
    en: { 'all': 'everything', 'hardware': 'hardware', 'web': 'web', 'competition': 'competitions', 'training': 'training' },
    th: { 'all': 'ทั้งหมด', 'hardware': 'ฮาร์ดแวร์', 'web': 'เว็บ', 'competition': 'การแข่งขัน', 'training': 'อบรม' }
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
