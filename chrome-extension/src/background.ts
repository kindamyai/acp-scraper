chrome.runtime.onInstalled.addListener(() => 
{
  console.log('Web Scraper Extension 
  installed');
  
  // Create context menu for scraping the 
  // current page
  chrome.contextMenus.create({ id: 
    'scrape-page', title: 'Scrape this page', 
    contexts: ['page'],
  });
  
  // Create context menu for scraping a 
  // specific element
  chrome.contextMenus.create({ id: 
    'scrape-element', title: 'Scrape this 
    element', contexts: ['selection'],
  });
});
// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, 
tab) => {
  if (!tab?.id) return;
  
  if (info.menuItemId === 'scrape-page') {
    // Open the web scraper app with the 
    // current URL pre-filled
    chrome.tabs.create({ url: 
      `http://localhost:3000/scraper/new?url=${encodeURIComponent(tab.url 
      || '')}`,
    });
  } else if (info.menuItemId === 
  } 'scrape-element' && info.selectionText) {
    // Inject a content script to get 
    // information about the selected element
    chrome.scripting.executeScript({ target: 
      { tabId: tab.id }, function: 
      getSelectionInfo,
    }, (results) => {
      if (results && results[0]?.result) { 
        const { selector, text } = 
        results[0].result;
        // Open the web scraper app with 
        // pre-filled selection info
        chrome.tabs.create({ url: 
          `http://localhost:3000/scraper/new?url=${encodeURIComponent(tab.url 
          || 
          '')}&selector=${encodeURIComponent(selector)}&text=${encodeURIComponent(text)}`,
        });
      }
    });
  }
});
// Function to get info about the selected 
// element
function getSelectionInfo() { const selection 
  = window.getSelection(); if (!selection || 
  selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0); 
  const element = 
  range.commonAncestorContainer.parentElement;
  
  // Generate a CSS selector for the element
  function generateSelector(el: Element): 
  string {
    if (!el) return ''; if (el.id) return 
    `#${el.id}`;
    
    let selector = el.tagName.toLowerCase(); 
    if (el.className) {
      const classes = 
      Array.from(el.classList).join('.'); if 
      (classes) {
        selector += `.${classes}`;
      }
    }
    
    // Add position if there are siblings
    const siblings = 
    Array.from(el.parentElement?.children || 
    [])
      .filter(child => child.tagName === 
      el.tagName);
    
    if (siblings.length > 1) { const index = 
      siblings.indexOf(el) + 1; selector += 
      `:nth-child(${index})`;
    }
    
    // Build the full path
    const parent = el.parentElement; if 
    (parent && parent.tagName !== 'BODY') {
      return `${generateSelector(parent)} > 
      ${selector}`;
    }
    
    return selector;
  }
  
  return { selector: generateSelector(element 
    as Element), text: selection.toString(),
  };
}
// Handle extension icon click
chrome.action.onClicked.addListener((tab) => 
{
  // Open the web scraper app with the 
  // current URL pre-filled
  chrome.tabs.create({ url: 
    `http://localhost:3000/scraper/new?url=${encodeURIComponent(tab.url 
    || '')}`,
  });
});
