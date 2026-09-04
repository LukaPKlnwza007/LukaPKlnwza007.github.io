/* ============================================================================
   data.js - every word on this site lives here.
   ----------------------------------------------------------------------------
   Change your details in this one file and all five pages follow.
   Look for « EDIT » markers, and « CHECK » where I guessed at something.
   ----------------------------------------------------------------------------
   Must load before every other script (it defines window.PORTFOLIO).
   ========================================================================= */

window.PORTFOLIO = (function () {
  'use strict';

  /* ---------- 1. Identity « EDIT » -------------------------------------- */
  const identity = {
    name:     'Denpoom Lothaisong',
    handle:   'LukaPKlnwza007',
    callsign: 'DENPOOM',                  // shown in the nav, boot screen, HUD
    role:     'Websites, and hardware that beeps at things',
    roleShort:'Web / Hardware',
    tagline:  'I make websites, and I wire up sensors until something beeps at ' +
              'the right moment. Most of what I know I learned by breaking it ' +
              'first, then working out why.',
    location: 'Loei, Thailand',
    school:   'Loei Pittayakom School',
    grade:    'Mathayom 5',
    photo:    'assets/img/profile.jpg',   // portrait on the home page
    timezone: 'ICT / UTC+7',
    available: true,
    availableText: 'Free after school',
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
    { label: 'Email',  handle: identity.email,                  href: 'mailto:' + identity.email }
  ];

  /* ---------- 3. How I got here « CHECK EVERY LINE » ---------------------
     I wrote this from what you told me: M5, websites and hardware, HTML/CSS/C,
     the traffic light, and the KKU competition. The years and the small stories
     are my guesses at a plausible order. Fix anything that is not true.
     -------------------------------------------------------------------- */
  const timeline = [
    {
      year: '2026',
      role: 'Went to a competition and lost to a dirt road',
      org:  'Geoinformatics Challenge, College of Computing, KKU',
      desc: 'Our school sent a team to the 4th Computing Fair. The event was ' +
            'GeoGuessr: you get dropped somewhere in the world and you have to ' +
            'work out where from road signs, power poles and which side of the ' +
            'road the cars are on. I now know more about Thai highway markers ' +
            'than is reasonable for someone my age.'
    },
    {
      year: '2025',
      role: 'Things that beep',
      org:  'A breadboard on my desk',
      desc: 'Started on C and sensors. The first time something I wrote made a ' +
            'light turn on in the actual room, not on a screen, I understood why ' +
            'people do this. Also learned that a loose jumper wire will cost you ' +
            'two hours and your dignity.'
    },
    {
      year: '2024',
      role: 'First page that was mine',
      org:  'Computer class, then at home instead of sleeping',
      desc: 'HTML and CSS. My first page was three colours, all of them wrong, ' +
            'and a centred div I fought for a week. But it was mine, it opened ' +
            'in a browser, and that was enough to keep going.'
    },
    {
      year: '2023',
      role: 'Opened a folder I should not have',
      org:  'The family computer',
      desc: 'I got curious about what was actually inside the machine instead of ' +
            'just using it. Changed some settings. Broke some things. Learned ' +
            'what System Restore is for. Genuinely where this started.'
    }
  ];

  /* ---------- 4. Skills « EDIT » -----------------------------------------
     Just names. A percentage next to a skill is a number somebody invented,
     and everybody reading it knows that. */
  const skills = [
    'HTML',
    'CSS',
    'C',
    'Sensors and breadboards'
  ];

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
     -------------------------------------------------------------------- */
  const projects = [
    {
      id: 'traffic-light',
      featured: true,
      name: 'Project 1',
      homeName: 'Activity 1',
      tagline: 'A traffic light that only bothers changing when someone is there',
      year: '2026',
      role: 'Wiring, C, and a lot of tape',
      client: 'School project',
      duration: 'A few weeks of afternoons',
      category: 'hardware',
      tags: ['C', 'Ultrasonic sensor', 'Arduino', 'LEDs'],
      cover: 'assets/img/work-traffic.svg',
      coverAlt: 'Drawing of a traffic light beside a distance sensor sending out sonar arcs',
      summary: 'An ultrasonic sensor watches the crossing. If nobody is waiting, ' +
               'the lights leave the traffic alone.',
      problem:
        'A normal traffic light runs on a timer and does not care whether anyone ' +
        'is standing there. So you get cars stopped at an empty crossing at ten ' +
        'at night, and everybody learns to ignore the light, which is the worst ' +
        'possible outcome for a traffic light. I wanted one that looks first.',
      process: [
        'Started with the sensor on its own. Print the distance, wave my hand at it, watch the number move. Nothing else got built until that was boring.',
        'Wired the three LEDs through resistors and got the normal red-amber-green cycle running on a timer, so I had something that worked before I made it clever.',
        'Added the rule: only run the cycle when the sensor sees something inside about a metre for more than a moment. A hand passing by should not stop traffic.',
        'Everything is delays and a state variable rather than one giant loop, so the light is never stuck waiting on the sensor when it should be changing.'
      ],
      learned: [
        'Test one part at a time. The day I wired all of it at once, I had three things that could be broken and no idea which one was.',
        'Sensors lie. Readings jump, and a single bad number should not be allowed to change the lights.',
        'Half of hardware debugging is pushing a wire back in.'
      ],
      tech: ['C', 'Arduino', 'HC-SR04 ultrasonic sensor', 'LEDs and resistors', 'Breadboard'],
      links: []
    },

    {
      id: 'geoinformatics',
      featured: true,
      name: 'Project 2',
      homeName: 'Activity 2',
      tagline: 'A day at KKU working out where in the world a photo was taken',
      year: '2026',
      role: 'Competitor, school team',
      client: '4th Computing Fair, College of Computing, Khon Kaen University',
      duration: 'One day, 17 August 2026',
      category: 'competition',
      tags: ['Geoinformatics', 'GeoGuessr', 'Team event'],
      cover: 'assets/img/work-1.jpg',
      coverAlt: 'Everyone who took part in the Geoinformatics Challenge 2026, lined up in front of the event screen',
      summary: 'Geoinformatics Challenge feat. GeoGuessr. Dropped somewhere on ' +
               'the map with no labels, and you have to argue your way to a country.',
      problem:
        'You get a street view and no other information. No place names, no ' +
        'coordinates, nothing helpful. What you do have is which side of the road ' +
        'the cars drive on, the shape of the power poles, the writing on a shop ' +
        'front, the colour of the soil, and the plants. It is geography, except ' +
        'you are reading it off the world instead of a map.',
      process: [
        'Registered in the morning, got a laptop and a table, and spent the first round finding out how much I did not know.',
        'Learned to look at the boring parts of the picture first. Road markings, bollards, the direction of traffic. The pretty scenery is usually useless.',
        'Argued with my team about a road that turned out to be nowhere near where any of us said.',
        'Finished the rounds, got the certificate, and stayed for the rest of the fair.'
      ],
      learned: [
        'Guessing is a skill and it has rules. People who are good at this are not lucky, they are reading things I had not noticed existed.',
        'Working in a team under a timer is a completely different thing from working alone with time.',
        'Going to a university and seeing what people there actually do is worth more than the placing.'
      ],
      tech: ['Geoinformatics', 'GeoGuessr', 'A lot of squinting at road signs'],
      gallery: [
        { src: 'assets/img/work-3.jpg', alt: 'Students at the registration desk holding Geoinformatics Challenge signs', caption: 'Registration, before anyone knew how hard it was going to be.' },
        { src: 'assets/img/work-5.jpg', alt: 'The competition hall set up and waiting, event slides on both screens', caption: 'The hall at the College of Computing, set up and waiting.' },
        { src: 'assets/img/work-2.jpg', alt: 'Two competitors working a round on one laptop, the street view they are placing on the projector behind them', caption: 'A round in progress. The screen behind is what everyone is trying to place.' },
        { src: 'assets/img/work-6.jpg', alt: 'Competitors and staff gathering at the side of the hall between rounds', caption: 'Fifteen minute break, which is exactly long enough to second-guess your last answer.' },
        { src: 'assets/img/work-4.jpg', alt: 'A participation certificate from the 4th Computing Fair 2026 lying on the desk beside a competition laptop', caption: 'The certificate, and the laptop that lost me several rounds.' }
      ],
      links: []
    },

    {
      id: 'this-site',
      featured: true,
      name: 'Project 3',
      homeName: 'Activity 3',
      tagline: 'The site you are reading, written by hand',
      year: '2026',
      role: 'All of it',
      client: 'Me',
      duration: 'Ongoing',
      category: 'web',
      tags: ['HTML', 'CSS', 'JavaScript'],
      cover: 'assets/img/work-site.svg',
      coverAlt: 'Drawing of a browser window over a grid, with a page being laid out inside it',
      summary: 'Five pages of hand-written HTML, CSS and JavaScript. No framework, ' +
               'no build step, no 300 packages to draw a button.',
      problem:
        'I wanted somewhere to put my work that was not a social media post that ' +
        'disappears down a feed in a day. And I wanted to build it rather than ' +
        'fill in a template, because filling in a template teaches you nothing ' +
        'except where that template put the buttons.',
      process: [
        'Every word on the site lives in one file, data.js. Change your name there and all five pages change, instead of me editing the same thing in five places and missing one.',
        'Plain HTML, CSS and JavaScript. Open any file and what is in it is what runs. No build step to learn before I can fix a typo.',
        'Layout is CSS Grid and Flexbox, so it reshapes for a phone instead of having a separate mobile version to keep in sync.',
        'One Three.js scene in the hero because I wanted to see if I could, and a Spring Boot endpoint behind the contact form for the same reason.'
      ],
      learned: [
        'Putting the content in one place instead of five was the single best decision in the whole thing.',
        'CSS is much less frightening once you stop guessing and start reading what a property actually does.',
        'Writing it by hand is slower at the start and much faster the moment something breaks, because I know where everything is.'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'Java', 'Spring Boot'],
      links: [{ label: 'Source', href: 'https://github.com/' + identity.handle + '/' + identity.handle + '.github.io' }]
    }
  ];

  /* ---------- 7. Filter labels ------------------------------------------- */
  const categories = {
    'all':         'everything',
    'hardware':    'hardware',
    'web':         'web',
    'competition': 'competitions'
  };

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
