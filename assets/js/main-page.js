// GLOBALS
let activePageId = '0';
let sizeIndex = 0;

// SET CSS VARS
function setNavCarriageHeight(){
  const navButtonHeight = navButton.getBoundingClientRect().height;

  document.documentElement.style.setProperty("--navigation-carriage-height", `${navButtonHeight}px`);
}

function getDropdownListHeigt(){
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown, index) => {
    const dropdownListHeight = dropdown.querySelector(".dropdown__list").getBoundingClientRect().height;

    document.documentElement.style.setProperty(`--dropdown-list-height-${index + 1}`, `${dropdownListHeight}px`);
  })
}

function getDropdownItemWidth(){
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown, index) => {
    const dropdownTitle = dropdown.querySelector(".dropdown__title");
    const dropdownItems = [...dropdown.querySelectorAll(".dropdown__item-inner"), dropdownTitle];

    const maxItemWidth = Math.ceil(Math.max(...dropdownItems.map(item => item.getBoundingClientRect().width)));

    document.documentElement.style.setProperty(`--dropdown-item-width-${index + 1}`, `${maxItemWidth}px`);
  })
}

function setErpSystemsItemHeight(){
  const descriptionHeight = document.querySelector(".erp-systems__description").getBoundingClientRect().height;

  document.documentElement.style.setProperty("--erp-systems-item-height", `${descriptionHeight}px`);
}

function setSizeIndex(){
  sizeIndex = (window.innerWidth / 100) + (window.innerHeight / 100);
}

// MENU BUTTON HANDLER
const navButton = document.querySelector(".aside__menu-button");
const navigation = document.querySelector(".navigation");
const navButtonText = document.querySelector(".menu-button__text_close")
let delayedNavHoverEnable;
let isNavOpen = false;

function enableNavButton(){
  if(window.innerWidth < 1024){
    navButtonText.innerHTML = 'menu'
  }
  navButton.addEventListener("click", navButtonHandler);
}

function navButtonHandler(){
  isNavOpen = !isNavOpen;

  if(isNavOpen){
    navButton.classList.add("open");

    openNavigation();
  } else {
    navButton.classList.remove("open");
    closeNavigation();
  }
}

function openNavigation(){
  if(window.innerWidth > 1023){
    gsap.to(navigation, {
      x: 0,
      duration: 1
    })
  } else {
    gsap.to(navigation, {
      y: 0,
      yPercent: 0,
      duration: 1
    })

    gsap.to(navButtonText, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        navButtonText.innerHTML = 'close'

        gsap.to(navButtonText, {
          opacity: 1,
          delay: 0.1,
          duration: 0.4
        })
      }
    })
  }

  showNavItems();
  movePageToSide();

  if(isGetInTouchOpen){
    getInTouchButtonHandler();
  }
}
function closeNavigation(){
  if(window.innerWidth > 1023){
    gsap.to(navigation, {
      x: -1 * sizeIndex * 30,
      duration: 1
    })
  } else {
    gsap.to(navigation, {
      yPercent: -100,
      y: 0,
      duration: 1
    })

    gsap.to(navButtonText, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        navButtonText.innerHTML = 'menu'

        gsap.to(navButtonText, {
          opacity: 1,
          delay: 0.1,
          duration: 0.4
        })
      }
    })
  }

  hideNavItems();

  movePageBack();
}

// GET IN TOUCH BUTTON HANDLER
const getInTouch = document.querySelector(".get-in-touch");
const getInTouchButton = document.querySelector(".get-in-touch__button");
const getInTouchButtonText = getInTouchButton.querySelector("span");
const getInTouchClose = document.querySelectorAll(".get-in-touch__close")[1];
const getInTouchCloseMob = document.querySelector(".get-in-touch__close_mobile");
const getInTouchInner = document.querySelector(".get-in-touch__inner");

let isGetInTouchOpen = false;

function enableGetInTouchButton(){
  getInTouchButton.addEventListener("click", getInTouchButtonHandler);
  getInTouchClose.addEventListener("click", getInTouchButtonHandler);
}

function getInTouchButtonHandler(){
  isGetInTouchOpen = !isGetInTouchOpen;

  if(isGetInTouchOpen){
    getInTouch.classList.add("open")

    openGetInTouchForm();
  } else {
    getInTouch.classList.remove("open")
    closeGetInTouchForm();
  }
}

function openGetInTouchForm(){
  if(window.innerWidth > 1023){
    gsap.to(getInTouchInner, {
      x: 0,
      duration: 1
    })
  } else {
    gsap.to(getInTouchInner, {
      y: 0,
      yPercent: 0,
      duration: 1
    })

    gsap.to(getInTouchButtonText, {
      opacity: 0,
      duration: 0.4
    })

    gsap.to(getInTouchCloseMob, {
      opacity: 1,
      delay: 0.5,
      duration: 0.4
    })
  }

  toggleActivePageShiftedClass();

  if(isNavOpen){
    navButtonHandler();
  }
}

function closeGetInTouchForm(){
  if(window.innerWidth > 1023){
    gsap.to(getInTouchInner, {
      x: -1 * sizeIndex * 30,
      duration: 1
    })
  } else {
    gsap.to(getInTouchInner, {
      y: 0,
      yPercent: -100,
      duration: 1
    })

    gsap.to(getInTouchButtonText, {
      opacity: 1,
      delay: 0.5,
      duration: 0.4
    })

    gsap.to(getInTouchCloseMob, {
      opacity: 0,
      duration: 0.4
    })
  }
  

  toggleActivePageShiftedClass();
}

// MENU MOUSE MOVE HANDLER
const navItems = [...document.querySelectorAll(".navigation__item")];
const navItemsTexts = [...document.querySelectorAll(".navigation__item-text")];
const navCarriage = document.querySelector(".navigation__carriage");

let navCarriageStartPos;
let navItemHeight;
let navCarriageHeight;

let navCarriagePosCalibrate;

function showNavItems(){
  gsap.set(navItemsTexts, {
    y: '-1.5em',
  });

  delayedNavHoverEnable = setTimeout(() => {
    gsap.to(navItemsTexts, {
      y: 0,
      duration: 0.7
    });
  
    enableNavItemsHover();
  }, 900);
}

function hideNavItems(){
  gsap.to(navItemsTexts, {
    y: '-1.5em',
    duration: 0.7
  });

  clearTimeout(delayedNavHoverEnable);
  disableNavItemsHover();
}

function enableNavItemsHover(){
  navCarriageStartPos = navCarriage.getBoundingClientRect().top;
  navCarriageHeight = navCarriage.getBoundingClientRect().height;
  navItemHeight = navItems[0].getBoundingClientRect().height;

  navCarriagePosCalibrate = (navItemHeight - navCarriageHeight) / 2;

  navItems.forEach((navItem) => {
    navItem.addEventListener("mouseenter", changeHoverItem);
  })
}

function disableNavItemsHover(){
  changeNavCarriagePosition(0);

  navItems.forEach((navItem) => {
    navItem.removeEventListener("mouseenter", changeHoverItem);
  })
}

function changeHoverItem({target}){
  const hoveredItem = target;

  const hoveredItemPos = hoveredItem.getBoundingClientRect().top;

  const newNavCarriagePosition = hoveredItemPos - navCarriageStartPos + navCarriagePosCalibrate;

  changeNavCarriagePosition(newNavCarriagePosition);
}

function changeNavCarriagePosition(position){
  gsap.to(navCarriage, {
    y: position,
    duration: 0.8,
    ease: 'Power1.easeInOut'
  })
}

// MENU BUTTONS HANDLER
const pages = [...document.querySelectorAll(".page")];
const homeButton = document.querySelector(".aside__logo-wrapper");
const homeButtonMobile = document.querySelector(".aside__mobile-header-logo");

function enableNavLinks(){
  navItems.forEach(navItem => {
    navItem.addEventListener("click", changePage);
  })
}

function enableHomeButton(){
  homeButton.addEventListener("click", toHomePage);
  homeButtonMobile.addEventListener("click", toHomePage);
}

function changePage(e){
  const currentItem = e.target.closest(".navigation__item");
  const currentItemId = currentItem.dataset.pageid;

  if(currentItemId !== activePageId){
    navButtonHandler();
    getActivePage().activePage.classList.remove("active");

    activePageId = currentItemId;

    setTimeout(() => {
      getActivePage().activePage.classList.add("active");
      getActivePage().openAnimation()
    }, 1000);
  }
}

function toHomePage(){
  if(activePageId !== '0'){
    if(isNavOpen){
      navButtonHandler();
    }

    getActivePage().activePage.classList.remove("active");
    activePageId = '0';

    setTimeout(() => {
      getActivePage().activePage.classList.add("active");
    }, 1000)
  }
}


// DROPDOWN HANDLER
const dropdowns = [...document.querySelectorAll(".dropdown")];
const dropdownsObjects = [];

function setDropDownsObjects(){
  dropdowns.forEach(dropdown => {
    const obj = {
      dropdown: dropdown,
      dropdownSelected: dropdown.querySelector(".dropdown__selected"),
      dropdownList: dropdown.querySelector(".dropdown__list"),
      dropdownItems: [...dropdown.querySelectorAll(".dropdown__item")],
      dropdownTitle: dropdown.querySelector(".dropdown__title"),
      dropdownCurrentOption: "",
      isDropdownOpen: false
    };

    obj.dropdownCurrentOption = obj.dropdownTitle.textContent;

    dropdownsObjects.push(obj);
  })
}

function enableDropDown(){
  dropdownsObjects.forEach((dropdown, index) => {
    closeDropdown(index);

    dropdown.dropdownSelected.addEventListener("click", dropdowndHandler.bind(null, index));

    enableDropDownItems(index);
  })
}

function enableDropDownItems(id){
  dropdownsObjects[id].dropdownItems.forEach(item => {
    item.addEventListener("click", changeDropdownOption);
  })
}

function changeDropdownOption({target}){
  const selectedOption = target.textContent;
  const selectedItemInner = target.classList.contains("dropdown__item-inner") ? target : target.querySelector(".dropdown__item-inner");
  const dropdownId = parseInt(selectedItemInner.dataset.dropdownId);

  selectedItemInner.innerHTML = dropdownsObjects[dropdownId].dropdownCurrentOption;

  dropdownsObjects[dropdownId].dropdownCurrentOption = selectedOption;

  dropdownsObjects[dropdownId].dropdownTitle.innerHTML = selectedOption;

  dropdowndHandler(dropdownId);
}

function dropdowndHandler(id){
  dropdownsObjects[id].isDropdownOpen = !dropdownsObjects[id].isDropdownOpen;

  if(dropdownsObjects[id].isDropdownOpen){
    openDropdown(id);
  } else {
    closeDropdown(id);
  }
}

function closeDropdown(id){
  dropdownsObjects[id].dropdownList.classList.add("close");
}
function openDropdown(id){
  dropdownsObjects[id].dropdownList.classList.remove("close");
}

// MOVE PAGE ON NAVIGATION STATE
function getActivePage(){
  const activePage = [...document.querySelectorAll(".page")].find(page => page.dataset.pageid === activePageId);
  return {
    activePage,
    moveContainer: activePage.querySelector("[data-move-container]"),
    fixedElements: activePage.querySelectorAll("[data-fixed]"),
    circleElement: activePage.querySelector(".circle-element"),
    openAnimation: activePageId === "2" ? servicesPageOpen : activePageId === "5" ? contactUsPageOpen : activePageId === '4' ? howWeWorkPageOpen : function(){return;}
  }
}

function movePageToSide(){
  const {activePage, moveContainer, fixedElements, circleElement} = getActivePage();

  toggleActivePageShiftedClass();

  const moveElement = moveContainer || activePage;

  if(window.innerWidth > 1023){
    gsap.to(moveElement, {
      x: sizeIndex * 30,
      duration: 1
    });
  } else {
    const yOffset = navigation.getBoundingClientRect().height;

    gsap.to(moveElement, {
      y: yOffset,
      duration: 1
    });
  }
  

  if(fixedElements && fixedElements.length){
    if(window.innerWidth > 1023){
      gsap.to(fixedElements, {
        x: -1 * sizeIndex * 30,
        duration: 1
      });
    } else {
      const yOffset = navigation.getBoundingClientRect().height;

      gsap.to(fixedElements, {
        y: -yOffset,
        duration: 1
      });
    }
  }

  if(circleElement){
    rotateCIrcleForward(circleElement, !(moveContainer));
  }
}
function movePageBack(){
  const {activePage, moveContainer, fixedElements, circleElement} = getActivePage();

  toggleActivePageShiftedClass();

  const moveElement = moveContainer || activePage;

  if(window.innerWidth > 1023){
    gsap.to(moveElement, {
      x: 0,
      duration: 1
    });
  } else {
    gsap.to(moveElement, {
      y: 0,
      duration: 1
    });
  }
  

  if(fixedElements && fixedElements.length){
    if(window.innerWidth > 1023){
      gsap.to(fixedElements, {
        x: 0,
        duration: 1
      });
    } else {
      gsap.to(fixedElements, {
        y: 0,
        duration: 1
      });
    }
  }

  if(circleElement){
    rotateCIrcleBack(circleElement);
  }
}

function rotateCIrcleForward(circle, offset){
  if(window.innerWidth > 1023){
    gsap.to(circle, {
      xPercent: offset ? 50 : 0,
      rotate: 270,
      duration: 1
    })
  } else{
    gsap.to(circle, {
      yPercent: 50,
      rotate: 270,
      duration: 1
    })
  }
  
}
function rotateCIrcleBack(circle){
  gsap.to(circle, {
    rotate: 0,
    duration: 1
  })
}

function toggleActivePageShiftedClass(){
  const {activePage, moveContainer} = getActivePage();

  const moveElement = moveContainer || activePage;

  moveElement.classList.toggle('shifted', !!(isNavOpen || isGetInTouchOpen));
}

// SERVICES PAGE TABS HANDLER
let activeServicesTab = '1';
const servicesPageTabButtons = [...document.querySelectorAll(".services-page__tab")];
const servicesPageTabPages = [...document.querySelectorAll(".services-page__content-tab")];
const servicesPageTabTitles = [...document.querySelectorAll(".services-page__aside-title")];

  // Services feedback form handler
  const servicesGetInTouchBtns = [...document.querySelectorAll(".services-get-in-touch-btn")];
  const servicesFeedBackModal = document.querySelector(".services-page__feedback");
  const servicesFeedBackClose = document.querySelector(".services-page__feedback-close");

  function enableServicesFeedBackBtns(){
    servicesGetInTouchBtns.forEach(btn => {
      btn.addEventListener("click", openServicesFeedBackModal);
    })
    servicesFeedBackClose.addEventListener("click", closeServicesFeedBackModal);
  }
  function openServicesFeedBackModal(){
    if(!servicesFeedBackModal.classList.contains("open")){
      servicesFeedBackModal.classList.add("open");

      gsap.fromTo(servicesFeedBackModal, {
        autoAlpha: 0,
        yPercent: -200
      }, {
        autoAlpha: 1,
        yPercent: -50,
        duration: 0.8,
      })

      setTimeout(() => {
        document.addEventListener('click', servicesModalClickOutsideHandler)  
      }, 500);
    }
  }
  function closeServicesFeedBackModal(){
    document.removeEventListener('click', servicesModalClickOutsideHandler)

    servicesFeedBackModal.classList.remove("open");
    
    gsap.to(servicesFeedBackModal, {
      autoAlpha: 0,
      duration: 0.8,
    })
  }
  function servicesModalClickOutsideHandler(e){
    if(!servicesFeedBackModal.contains(e.target)){
      closeServicesFeedBackModal();
    }
  }
  // END OF Services feedback form handler

function enableServicesTabs(){
  servicesPageTabButtons.forEach(tab => {
    tab.addEventListener('click', changeServicesTab);
  })
}

function changeServicesTab(evt){
  const currentTab = evt.target.closest(".services-page__tab");
  const currentTabId = currentTab.dataset.servicetabid;
  const activeTab = getActiveServicesTabContent();
  const activeTitle = getActiveServicesTabTitle();

  if(currentTabId !== activeServicesTab){
    getActiveServicesTabItem().classList.remove('active');
    activeTab.closeAnimation();
    servicesTitleClose();
    setTimeout(() => {
      activeTab.activeTab.classList.remove('active');  
      activeTitle.classList.remove('active');

      getActiveServicesTabTitle().classList.add('active');
      servicesTitleOpen();
    }, 950);

    activeServicesTab = currentTabId;

    getActiveServicesTabItem().classList.add('active');
    setTimeout(() => {
      getActiveServicesTabContent().activeTab.classList.add('active'); 
      getActiveServicesTabContent().openAnimation();
    }, 1000);
  }
}

function getActiveServicesTabContent(){
  return {
    activeTab: servicesPageTabPages.find(page => page.dataset.servicetabid === activeServicesTab),
    openAnimation: activeServicesTab === '1' ? webDevOpen : activeServicesTab === '2' ? mobAppOpen : activeServicesTab === '3' ? chatBotsOpen : activeServicesTab === '4' ? websiteSecurityOpen : activeServicesTab === '5' ? erpSystemsOpen : activeServicesTab === '6' ? copyrightSmmOpen : function(){return;},
    closeAnimation: activeServicesTab === '1' ? webDebClose : activeServicesTab === '2' ? mobAppClose : activeServicesTab === '3' ? chatBotsClose : activeServicesTab === '4' ? websiteSecurityClose : activeServicesTab === '5' ? erpSystemsClose : activeServicesTab === '6' ? copyrightSmmClose : function(){return;},
  }
}

function getActiveServicesTabItem(){
  return servicesPageTabButtons.find(tab => tab.dataset.servicetabid === activeServicesTab)
}

function getActiveServicesTabTitle(){
  return servicesPageTabTitles.find(title => title.dataset.servicetabid === activeServicesTab)
}

  // SERVICES TABS ANIMATION
  function servicesTitleOpen(){
    const title = getActiveServicesTabTitle();

    gsap.from(title, {
      xPercent: -110,
      duration: 1,
      clearProps: true
    })
  }
  function servicesTitleClose(){
    const title = getActiveServicesTabTitle();

    gsap.to(title, {
      xPercent: 110,
      duration: 1,
      clearProps: true
    })
  }
  function webDevOpen(){
    const title = document.querySelector(".services-page__title")
    const content = document.querySelector(".services-page__content-inner")
    // const asideTitles = document.querySelector(".services-page__aside-titles")
    // const tabsList = document.querySelector(".services-page__tabs-list")


    gsap.from(title, {
      xPercent: -100,
      duration: 0.6
    })
    gsap.from(title, {
      yPercent: 100,
      duration: 0.4,
      delay: 0.6
    })
    gsap.from(content, {
      yPercent: 100,
      duration: 1
    })
    // gsap.from(asideTitles, {
    //   y: '-100vh',
    //   duration: 1,
    // })
    // gsap.from(tabsList, {
    //   xPercent: 100,
    //   duration: 1
    // })
  }
  function webDebClose(){
    const items = [...document.querySelectorAll(".services-page__content-item")];

    items.forEach((item, id) => {
      if(id % 2 === 0){
        gsap.to(item, {
          xPercent: 110,
          duration: 1,
          clearProps: true
        })
      } else {
        gsap.to(item, {
          xPercent: -110,
          duration: 1,
          clearProps: true
        })
      }
    })
  }
  function mobAppOpen(){
    const mobAppPage = document.querySelector(".mobile-apps");

    gsap.from(mobAppPage, {
      yPercent: -110,
      duration: 1,
      clearProps: true
    })
  }
  function mobAppClose(){
    const title = document.querySelector(".mobile-apps__title");
    const items = [...document.querySelectorAll(".mobile-apps__item")];

    gsap.to(title, {
      xPercent: -110,
      duration: 1,
      clearProps: true
    })
    gsap.to(items[0], {
      y: '100vh',
      duration: 1,
      clearProps: true
    })
    gsap.to(items[1], {
      y: '-100vh',
      duration: 1,
      clearProps: true
    })
  }
  function chatBotsOpen(){
    const title = document.querySelector(".chat-bots__title");
    const infoCover = document.querySelector(".chat-bots__info-cover");
    const numbers = [...document.querySelectorAll(".chat-bots__list-number")];
    const listTitles = [...document.querySelectorAll(".chat-bots__list-title")];

    gsap.from(title, {
      yPercent: -110,
      duration: 1,
      clearProps: true
    })
    gsap.from(infoCover, {
      yPercent: -110,
      duration: 1,
      clearProps: true
    })
    gsap.from(numbers, {
      x: '-20vw',
      duration: 0.8,
      stagger: 0.2,
      clearProps: true
    })
    gsap.from(listTitles, {
      y: 50,
      duration: 1,
      clearProps: true
    })
  }
  function chatBotsClose(){
    const title = document.querySelector(".chat-bots__title");
    const info = document.querySelector(".chat-bots__info");
    const list = document.querySelectorAll(".chat-bots__list");

    gsap.to(title, {
      xPercent: -120,
      duration: 1,
      clearProps: true
    })
    gsap.to(info, {
      xPercent: 120,
      duration: 1,
      clearProps: true
    })
    gsap.to(list, {
      y: '100vh',
      duration: 1,
      clearProps: true
    })
  }
  function copyrightSmmOpen(){
    const title = document.querySelector(".copyright-smm__title");
    const items = [...document.querySelectorAll(".copyright-smm__item")];

    gsap.from(title, {
      y: -300,
      duration: 1,
      cleaProps: true
    })
    gsap.from(items[0], {
      xPercent: -110,
      duration: 1,
      delay: 0.5,
      clearProps: true
    })
    gsap.from(items[1], {
      yPercent: 250,
      duration: 1,
      delay: 1,
      clearProps: true
    })
  }
  function copyrightSmmClose(){
    const title = document.querySelector(".copyright-smm__title");
    const items = [...document.querySelectorAll(".copyright-smm__item")];


    gsap.to(title, {
      x: '70vw',
      duration: 0.8,
      delay: 0.2,
      clearProps: true
    })
    gsap.to(items[0], {
      x: '78.75vw',
      duration: 0.9,
      delay: 0.1,
      clearProps: true
    })
    gsap.to(items[1], {
      x: '87.5vw',
      duration: 1,
      clearProps: true
    })
  }
  function websiteSecurityOpen(){
    const title = document.querySelector(".website-security__title");
    const content = document.querySelector(".website-security__content");
    const items = [...document.querySelectorAll(".website-security__item-inner")];

    gsap.from(title, {
      xPercent: -110,
      duration: 1,
      clearProps: true
    })
    gsap.from(content, {
      y: '-100vh',
      duration: 1,
      clearProps: true
    })
    gsap.from(items[0], {
      opacity: 0,
      yPercent: -70,
      duration: 1,
      delay: 1,
      clearProps: true
    })
    gsap.from(items[1], {
      opacity: 0,
      yPercent: 70,
      duration: 1,
      delay: 1,
      clearProps: true
    })
  }
  function websiteSecurityClose(){
    const title = document.querySelector(".website-security__title");
    const items = [...document.querySelectorAll(".website-security__item")];
    const line1 = items[0].querySelector(".vert-line");
    const line2 = items[1].querySelector(".vert-line");

    gsap.to(title, {
      yPercent: -110,
      duration: 1,
      clearProps: true
    })
    gsap.to(line1, {
      x: -30,
      duration: 0.5
    })
    gsap.to(line1, {
      delay: 1,
      duration: 1,
      clearProps: true
    })
    gsap.to(line2, {
      x: 30,
      duration: 0.5
    })
    gsap.to(line2, {
      delay: 1,
      duration: 1,
      clearProps: true
    })
    gsap.to(items[0], {
      x: '-35vw',
      duration: 0.85,
      delay: 0.15,
      clearProps: true
    })
    gsap.to(items[1], {
      x: '35vw',
      duration: 0.85,
      delay: 0.15,
      clearProps: true
    })
  }
  function erpSystemsOpen(){
    const descriptionHeight = document.querySelector(".erp-systems__description").getBoundingClientRect().height;
    const page = document.querySelector(".erp-systems");
    const item = document.querySelector(".erp-systems__item");
    const itemInner = document.querySelector(".erp-systems__item-inner");

    gsap.from(page, {
      xPercent: -100,
      duration: 1,
      clearProps: true
    })
    gsap.from(item, {
      xPercent: -40,
      duration: 1,
      delay: 0.8,
      clearProps: true
    })
    gsap.to(itemInner, {
      maxHeight: descriptionHeight,
      duration: 1,
      delay: 1.5
    })
  }
  function erpSystemsClose(){
    const page = document.querySelector(".erp-systems");
    const item = document.querySelector(".erp-systems__item");
    const itemInner = document.querySelector(".erp-systems__item-inner");

    gsap.to(itemInner, {
      maxHeight: 2,
      duration: 0.4,
    })
    gsap.to(item, {
      xPercent: -40,
      duration: 0.4,
      delay: 0.2,
    })
    gsap.to(item, {
      duration: 1,
      delay: 1,
      clearProps: true
    })
    gsap.to(page, {
      xPercent: -100,
      duration: 1,
      delay: 0.5,
      clearProps: true
    })
  }

// FOOTER
let footerIsOpened = false;
const footerButton = document.querySelector(".main-footer__messengers-title");
const footerCoverL = document.querySelectorAll(".main-footer__messengers-cover-item")[0];
const footerCoverR = document.querySelectorAll(".main-footer__messengers-cover-item")[1];
const footerButtons = document.querySelector(".main-footer__messengers-buttons")
const footerClose = document.querySelector(".main-footer__messengers-close")

function enableFooterButton(){
  footerButton.addEventListener("click", openMainFooter)
  footerClose.addEventListener("click", closeMainFooter)
}

function openMainFooter(){
  gsap.to(footerCoverL, {
    x: 0,
    xPercent: 0,
    duration: 0.8,
    onComplete: () => {
      gsap.to(footerCoverL, {
        x: 0,
        xPercent: -100,
        delay: 0.2,
        duration: 0.8,
      })
    }
  })
  gsap.to(footerCoverR, {
    x: 0,
    xPercent: 0,
    duration: 0.8,
    onComplete: () => {
      gsap.to(footerCoverR, {
        x: 0,
        xPercent: 100,
        delay: 0.2,
        duration: 0.8,
      })
    }
  })

  gsap.to(footerButton, {
    autoAlpha: 0,
    delay: 0.8,
    duration: 0.1
  })

  gsap.to(footerButtons, {
    autoAlpha: 1,
    delay: 0.8,
    duration: 0.1
  })

  gsap.fromTo(footerClose, {
    opacity: 0,
  }, {
    opacity: 1,
    delay: 1.2,
    duration: 0.5
  })
}

function closeMainFooter(){
  gsap.to(footerCoverL, {
    x: 0,
    xPercent: 0,
    duration: 0.8,
    onComplete: () => {
      gsap.to(footerCoverL, {
        x: 0,
        xPercent: -100,
        delay: 0.2,
        duration: 0.8,
      })
    }
  })
  gsap.to(footerCoverR, {
    x: 0,
    xPercent: 0,
    duration: 0.8,
    onComplete: () => {
      gsap.to(footerCoverR, {
        x: 0,
        xPercent: 100,
        delay: 0.2,
        duration: 0.8,
      })
    }
  })

  gsap.to(footerButton, {
    autoAlpha: 1,
    delay: 0.8,
    duration: 0.1
  })

  gsap.to(footerButtons, {
    autoAlpha: 0,
    delay: 0.8,
    duration: 0.1
  })
}

// ABOUT PAGE SCROLL ANIMATION
const aboutPage = document.querySelector(".about-page");
const aboutPageInner = document.querySelector(".about-page__inner");
const aboutPageTitle = document.querySelector(".about-page__title");
const aboutPageCover = document.querySelector(".about-page__cover");
const aboutPagePhilosophy = document.querySelector(".about-page__philosophy-block");
const aboutPagePhilosophyTitleFill = document.querySelector(".about-page__philosophy-title-fill");
const aboutPageCover2 = document.querySelector(".about-page__cover_2");
const aboutPageTitleBottom = document.querySelector(".about-page__bottom-title");
const aboutPageContacts = document.querySelector(".about-page__contacts");

const aboutPageAnimation = gsap.timeline({
  scrollTrigger: {
    scroller: aboutPage,
    trigger: aboutPageInner,
    scrub: true,
    start: "top top",
    end: "bottom bottom",
  },
  duration: 0,
});

aboutPageAnimation.addLabel("hideTitle");
aboutPageAnimation.to(aboutPageTitle, {
  yPercent: 900,
  duration: 1,
}, 'hideTitle');

aboutPageAnimation.addLabel("fillPhilosophyTitle", "<+0.65hideTitle");
aboutPageAnimation.to(aboutPagePhilosophyTitleFill, {
  width: "100%",
  duration: 0.2,
}, 'fillPhilosophyTitle');

aboutPageAnimation.addLabel("moveTopPhilosophy", ">fillPhilosophyTitle");
aboutPageAnimation.to(aboutPagePhilosophy, {
  yPercent: -105,
  duration: 0.15,
}, 'moveTopPhilosophy');

gsap.to(aboutPagePhilosophy, {
  scrollTrigger: {
    scroller: aboutPage,
    trigger: aboutPageCover,
    start: "20% top",
    toggleActions: 'play none none reverse'
  },
  autoAlpha: 1,
  duration: 0.2
})

const aboutSecondCoverAnimation = gsap.timeline({
  scrollTrigger: {
    scroller: aboutPage,
    trigger: aboutPageTitleBottom,
    scrub: true,
    start: "top bottom",
    end: "top top",
  },
  duration: 0.4
});

aboutSecondCoverAnimation.addLabel("openSecondCover");
aboutSecondCoverAnimation.to(aboutPageCover2, {
  xPercent: 200,
}, "openSecondCover")

gsap.to(aboutPageContacts, {
  scrollTrigger: {
    scroller: aboutPage,
    trigger: aboutPageTitleBottom,
    start: "top 40%",
    toggleActions: "play none none reverse"
  },
  autoAlpha: 1,
  duration: 0.2
})

gsap.to(aboutPageContacts, {
  scrollTrigger: {
    scroller: aboutPage,
    trigger: aboutPageTitleBottom,
    start: "top 13%",
    toggleActions: "play none none reverse",
  },
  zIndex: 2
})


// CONCEPTS SLIDER
let conceptsActiveSlide = 1;
const conceptsSlides = [...document.querySelectorAll(".concepts__item")];
const conceptsNumberOfSlides = conceptsSlides.length;
const conceptsUpButton = document.querySelector(".concepts__slider-button_up");
const conceptsDownButton = document.querySelector(".concepts__slider-button_down");
const borderSlides = [];
let conceptsRulleroffset = 1;
const conceptsMobButtons = [...document.querySelectorAll(".concepts__mob-pagination-number")]

function enableConceptsMobButtons(){
  conceptsMobButtons.forEach((button, index) => {
    button.addEventListener("click", conceptsGoToSlide.bind(null, index))
  })
}

function setPagesRuler(){
  if(window.innerWidth < 1024) return;
  
  const pagination = document.querySelector(".concepts__pagination-inner");

  for(let k = 0; k < conceptsNumberOfSlides; k++){
    const page = document.createElement("div");
    page.classList.add("concepts__page");
    page.dataset.slideId = k + 1;

    if(k === 0){
      page.classList.add("active");
    }

    for(let i = 0; i < 10; i++){
      const line = document.createElement("div");
      line.classList.add("concepts__page-line");

      if(i === 0){
        line.classList.add("concepts__page-line_main");

        const number = document.createElement("button");
        number.classList.add("concepts__page-number");
        number.innerHTML = (k + 1).toString().length < 2 ? '0' + (k + 1) : k + 1;

        line.appendChild(number);

        number.addEventListener("click", conceptsGoToSlide.bind(null, k + 1))
      }
      if(i === 5){
        line.classList.add("concepts__page-line_center");
      }

      page.appendChild(line);
    }

    pagination.appendChild(page);
  }
  setBorderSlides();
}
function setBorderSlides(){
  if(window.innerWidth < 1024) return;

  const ruller = document.querySelector(".concepts__pagination");
  const rullerHeight = ruller.getBoundingClientRect().height;
  const rullerInner = document.querySelector(".concepts__pagination-inner");
  const rullerInnerHeight = rullerInner.getBoundingClientRect().height;
  const page = document.querySelector(".concepts__page");
  const pageHeight = page.getBoundingClientRect().height;

  if(rullerHeight < rullerInnerHeight){
    const pagesInView = Math.floor(rullerHeight / (pageHeight + 5));

    borderSlides.push(1);
    borderSlides.push(pagesInView);
  }
}
function conceptsUpdateCounter(){
  const counterCurrent = document.querySelector(".concepts__current");
  counterCurrent.innerHTML = conceptsActiveSlide.toString().length < 2 ? "0" + conceptsActiveSlide : conceptsActiveSlide;

  const pages = [...document.querySelectorAll(".concepts__page")];
  pages.forEach(page => {
    page.classList.remove("active");

    if(parseInt(page.dataset.slideId) === conceptsActiveSlide){
      page.classList.add("active");
    }
  })

  moveRuler();
}
function moveRuler(){
  if(window.innerWidth < 1024) return;

  const rullerInner = document.querySelector(".concepts__pagination-inner");
  const page = document.querySelector(".concepts__page");
  const pageHeight = page.getBoundingClientRect().height;

  if(borderSlides.length){
    if(conceptsActiveSlide >= borderSlides[1] && conceptsActiveSlide !== conceptsNumberOfSlides){
      rullerInner.style.transform = `translateY(-${conceptsRulleroffset * pageHeight}px)`;
      conceptsRulleroffset = conceptsRulleroffset + (conceptsActiveSlide - borderSlides[1] + 1);
      borderSlides[0] = borderSlides[0] + (conceptsActiveSlide - borderSlides[1] + 1);
      borderSlides[1] = borderSlides[1] + (conceptsActiveSlide - borderSlides[1] + 1);
    }
    if(conceptsActiveSlide <= borderSlides[0] && conceptsActiveSlide !== 1){
      rullerInner.style.transform = `translateY(-${(conceptsRulleroffset - 2) * pageHeight}px)`;
      conceptsRulleroffset = conceptsRulleroffset - (borderSlides[0] - conceptsActiveSlide + 1);
      borderSlides[1] = borderSlides[1] - (borderSlides[0] - conceptsActiveSlide + 1);
      borderSlides[0] = borderSlides[0] - (borderSlides[0] - conceptsActiveSlide + 1);
    }
  }
}
function enableConceptsButtons(){
  const counterTotal = document.querySelector(".concepts__total");
  counterTotal.innerHTML = conceptsNumberOfSlides.toString().length < 2 ? "0" + conceptsNumberOfSlides : conceptsNumberOfSlides;

  conceptsUpButton.addEventListener("click", conceptsPrevSlide);
  conceptsDownButton.addEventListener("click", conceptsNextSlide);
}
function conceptsNextSlide(){
  if(conceptsActiveSlide === conceptsNumberOfSlides) return;

  if(window.innerWidth > 1023){
    const curSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];
    const prevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 1];
    const beforePrevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 2];
    const offscreenSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 3];

    conceptsSlideReset();

    if(curSlide){
      curSlide.classList.add("next");

      conceptsActiveSlide++;
      conceptsUpdateCounter();
    }
    if(prevSlide){
      prevSlide.classList.add("active");
    }
    if(beforePrevSlide){
      beforePrevSlide.classList.add("previos");
    }
    if(offscreenSlide){
      offscreenSlide.classList.add("before-previos");
    }

    conceptsSlidesToBottom();
  } else {
    conceptsActiveSlide++;
    conceptsUpdateCounter();

    const curSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];
    const prevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide + 1];

    if(curSlide){
      gsap.fromTo(curSlide, {
        xPercent: 100,
        x: 0
      }, {
        xPercent: 0,
        x: 0,
        duration: 0.8
      })
    }
    if(prevSlide){
      gsap.fromTo(prevSlide, {
        xPercent: 0,
        x: 0
      }, {
        xPercent: -100,
        x: 0,
        duration: 0.8
      })
    }

    updateMobPagination();
  }
}
function conceptsPrevSlide(){
  if(conceptsActiveSlide === 1) return;

  if(window.innerWidth > 1023){
    const curSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];
    const prevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 1];
    const nextSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide + 1];

    conceptsSlideReset();

    if(curSlide){
      curSlide.classList.add("previos");

      conceptsActiveSlide--;
      conceptsUpdateCounter();
    }
    if(prevSlide){
      prevSlide.classList.add("before-previos");
    }
    if(nextSlide){
      nextSlide.classList.add("active");
    }

    conceptsSlidesToBottom();
  } else {
    conceptsActiveSlide--;
    conceptsUpdateCounter();

    const curSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];
    const nextSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 1];

    if(curSlide){
      gsap.fromTo(curSlide, {
        xPercent: -100,
        x: 0
      }, {
        xPercent: 0,
        x: 0,
        duration: 0.8
      })
    }
    if(nextSlide){
      gsap.fromTo(nextSlide, {
        xPercent: 0,
        x: 0
      }, {
        xPercent: 100,
        x: 0,
        duration: 0.8
      })
    }

    updateMobPagination();
  }
}
function conceptsGoToSlide(id){
  if(window.innerWidth > 1023){
    conceptsActiveSlide = id;
    conceptsUpdateCounter();

    const curSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];
    const prevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 1];
    const beforePrevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide - 2];

    conceptsSlideReset();

    if(curSlide){
      curSlide.classList.remove("next");
      curSlide.classList.add("active");
    }
    if(prevSlide){
      curSlide.classList.remove("next");
      prevSlide.classList.add("previos");
    }
    if(beforePrevSlide){
      curSlide.classList.remove("next");
      beforePrevSlide.classList.add("before-previos");
    }

    conceptsSlidesToBottom();
  } else {
    if(conceptsActiveSlide === (id + 1)) return;

    const direction = (id + 1) < conceptsActiveSlide ? 'back' : 'forward'

    const prevSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];

    conceptsActiveSlide = id + 1;
    conceptsUpdateCounter();

    const curSlide = conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide];
    
    if(prevSlide){
      if(direction === 'back'){
        gsap.fromTo(prevSlide, {
          xPercent: 0,
          x: 0
        }, {
          xPercent: 100,
          x: 0,
          duration: 0.8
        })
      } else {
        gsap.fromTo(prevSlide, {
          xPercent: 0,
          x: 0
        }, {
          xPercent: -100,
          x: 0,
          duration: 0.8
        })
      }
    }
    if(curSlide){
      if(direction === 'back'){
        gsap.fromTo(curSlide, {
          xPercent: -100,
          x: 0
        }, {
          xPercent: 0,
          x: 0,
          duration: 0.8
        })
      } else {
        gsap.fromTo(curSlide, {
          xPercent: 100,
          x: 0
        }, {
          xPercent: 0,
          x: 0,
          duration: 0.8
        })
      }
    }

    updateMobPagination();
  }
}
function conceptsSlideReset(){
  conceptsSlides.forEach(slide => {
    slide.classList.remove("active");
    slide.classList.remove("next");
    slide.classList.remove("previos");
    slide.classList.remove("before-previos");
  })
}
function conceptsSlidesToBottom(){
  for(let i = 1; i < conceptsNumberOfSlides; i++){
    if(conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide + i]){
      conceptsSlides[conceptsNumberOfSlides - conceptsActiveSlide + i].classList.add("next");
    }
  }
}
function updateMobPagination(){
  conceptsMobButtons.forEach((button, index) => {
    if(index + 1 === conceptsActiveSlide){
      button.classList.add("active")
    } else {
      button.classList.remove("active")
    }
  })
}

// PAGES OPEN ANIMATIONS
function servicesPageOpen(){
  const title = document.querySelector(".services-page__title")
  const content = document.querySelector(".services-page__content-inner")
  const asideTitles = document.querySelector(".services-page__aside-titles")
  const tabsList = document.querySelector(".services-page__tabs-list")


  gsap.from(title, {
    xPercent: -100,
    duration: 0.6
  })
  gsap.from(title, {
    yPercent: 100,
    duration: 0.4,
    delay: 0.6
  })
  gsap.from(content, {
    yPercent: 100,
    duration: 1
  })
  gsap.from(asideTitles, {
    y: '-100vh',
    duration: 1,
  })
  gsap.from(tabsList, {
    xPercent: 100,
    duration: 1
  })
}

function contactUsPageOpen(){
  const title = document.querySelector(".contact-us__title");
  const inner = document.querySelector(".contact-us__header-decor-inner");

  gsap.fromTo(title, {
    yPercent: -100,
  }, {
    yPercent: 0,
    duration: 1
  })

  gsap.from(inner, {
    height: 0,
    duration: 1
  })
}

// How we work page animation
function howWeWorkPageOpen(){
  const items = document.querySelectorAll(".how-we-work__item");

  if(window.innerWidth < 1024){
    items.forEach((item, index) => {
      const number = item.querySelector(".how-we-work__item-number");
      const description = item.querySelector(".how-we-work__item-description");
      const line = item.querySelector(".how-we-work__item-description-line");

      gsap.fromTo(number, {
        x: -200,
      }, {
        x: 0,
        duration: 0.6
      })

      gsap.fromTo(line, {
        transformOrigin: 'top center',
        scaleY: 0,
      }, {
        transformOrigin: 'top center',
        scaleY: 1,
        delay: 0.6,
        duration: 0.6,
      })

      gsap.fromTo(description, {
        x: "100vw",
      }, {
        x: 0,
        duration: 0.6,
        delay: 1.2 + (0.1 * index)
      })
    })
  }
}

function preloaderAnimation(){
  const preloader = document.querySelector(".preloader");
  const preloaderItems = document.querySelector(".preloader__items");
  const preloaderTopArrow = document.querySelectorAll(".preloader__item")[0];
  const preloaderBotArrow = document.querySelectorAll(".preloader__item")[1];
  const preloaderTopCover = document.querySelectorAll(".preloader__cover")[0];
  const preloaderBotCover = document.querySelectorAll(".preloader__cover")[1];
  const preloaderLines = document.querySelectorAll(".preloader__cover-line");

  gsap.to(preloaderItems, {
    rotate: -180,
    duration: 1.5,
    delay: 2,
  })

  gsap.to(preloaderTopArrow, {
    x: "-70vw",
    duration: 2,
    delay: 3.2,
  })
  gsap.to(preloaderBotArrow, {
    x: "70vw",
    duration: 2,
    delay: 3.2,
  })

  gsap.to(preloaderLines, {
    scaleX: 1.38,
    duration: 2,
    delay: 3.25,
  })

  gsap.to(preloaderTopCover, {
    yPercent: -120,
    duration: 1.5,
    delay: 4.3,
  })
  gsap.to(preloaderBotCover, {
    yPercent: 120,
    duration: 1.5,
    delay: 4.3,
    onComplete: () => {
      preloader.remove()
    }
  })
}

// INIT FUNCTION
function initVA(){
  setSizeIndex();
  setTimeout(setNavCarriageHeight, 500); // set navigation carriage height
  getDropdownListHeigt(); // set max dropdown list height
  getDropdownItemWidth(); // set even dropdown items width
  setDropDownsObjects();
  setErpSystemsItemHeight();
  setPagesRuler();

  enableNavButton(); // enable navigation close/open button
  enableGetInTouchButton(); // enable Get In Touch close/open button
  enableFooterButton();
  enableDropDown();
  enableHomeButton();
  enableNavLinks();
  enableServicesTabs();
  enableConceptsButtons();
  enableServicesFeedBackBtns();
  enableConceptsMobButtons();

  preloaderAnimation();

  window.onresize = setSizeIndex;
}



initVA();