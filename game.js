const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
  state = {
    inventory: []
  }
  showTextNode(0)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find((textNode) => textNode.id === textNodeIndex);

  if (!textNode) {
    console.error(`Error: TextNode with id ${textNodeIndex} not found.`);
    return;
  }

  console.log('Showing TextNode:', textNode);

  textElement.innerText = textNode.text;

  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
  }

  textNode.options.forEach((option) => {
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.classList.add('btn');
      button.addEventListener('click', () => selectOption(option));
      optionButtonsElement.appendChild(button);
    }
  });

  updateStatsDisplay();
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  let nextTextNodeId;

  // Check if the option has a conditional nextText based on class
  if (typeof option.nextText === 'function') {
    nextTextNodeId = option.nextText(state);
  } else {
    nextTextNodeId = option.nextText;
  }

  // Handle special cases or additional logic based on class
  if (state.class === 'Rogue' && option.specialForRogue) {
    // Example: Handle special logic for Rogue
    // You can define this property in specific options for the Rogue class
    nextTextNodeId = option.specialForRogue(state);
  }

  // Handle other special cases or class-specific logic here...

  if (nextTextNodeId <= 0) {
    return startGame();
  }

  state = Object.assign(state, option.setState);
  showTextNode(nextTextNodeId);
  updateStatsDisplay();
}
function updateStatsDisplay() {
  const classText = document.getElementById('class-text');
  const inventoryText = document.getElementById('inventory');

  // Set class text based on player's class
  if (state.class) {
    classText.innerText = `Class: ${state.class}`;
  } else {
    classText.innerText = 'Class: Peasant';
  }

  if (state.inventory.length > 0) {
    inventoryText.innerText = `Inventory: ${state.inventory.join(', ')}`;
  } else {
    inventoryText.innerText = 'Inventory: None';
  }
}
const textNodes = [
  {id: 0, // Class selection
    text: 'Choose your class:',
    options: [
      {
        text: 'Ranger',
        setState: { class: 'Ranger' },
        nextText: 1
      },
      {
        text: 'Knight',
        setState: { class: 'Knight' },
        nextText: 1
      },
      {
        text: 'Rogue',
        setState: { class: 'Rogue' },
        nextText: 1
      },
      {
        text: 'Wizard',
        setState: { class: 'Wizard' },
        nextText: 1
      }
    ]
  },
  {
    id: 1,
    text: "You arrive in town as an adventurer ready to defeat the dragon that has taken over the nearby Castle, along the way you discover some of the dragon's scales have fallen nearby",
    options: [
      {
        text: 'Take scales',
        setState: { scales: true, inventory: ['Dragon Scales']},
        nextText: 2
      },
      {
        text: 'Leave the scales',
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: 'You venture forth in search of answers when you come across a merchant.',
    options: [
      {
        text: 'Trade the scales for a sword',
        requiredState: (currentState) => currentState.inventory.includes('Dragon Scales'),
        setState: { inventory: ['Sword'], scales: false },
        nextText: 3
      },
      {
        text: 'Trade the scales for a shield',
        requiredState: (currentState) => currentState.inventory.includes('Dragon Scales'),
        setState: { inventory: ['Shield'], scales: false },
        nextText: 3
      },
      {
        text: 'Ignore the merchant',
        nextText: 3
      }
    ]
  },
  
  {
    id: 3,
    text: 'After leaving the merchant you start to feel tired and stumble upon a small town next to a dangerous looking castle.',
    options: [
      {
        text: 'Explore the castle',
        nextText: 4
      },
      {
        text: 'Find a room to sleep at in the town',
        nextText: 5
      },
      {
        text: 'Find some hay in a stable to sleep in',
        nextText: 6
      }
    ]
  },
  {
    id: 4,
    text: "You are so tired that you fall asleep while exploring the castle and are awoken by the sound of the dragon's jaws chomping down on you.",
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 5,
    text: 'Without any money to buy a room you break into the nearest inn and fall asleep. After a few hours of sleep the owner of the inn finds you and has the town guard lock you in a cell.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 6,
    text: 'You wake up well-rested and full of energy ready to explore the nearby castle.',
    options: [
      {
        text: 'Explore the castle',
        nextText: 7
      },
      {
        text: 'Explore the Dungeons beneath the castle',
        nextText: (currentState) => {
          switch (currentState.class) {
            case 'Wizard':
              return 12;  // Send the wizard to id 12
            case 'Knight':
              return 14;  // Send the knight to id 14
            case 'Rogue':
              return 17;  // Send the rogue to id 17
            case 'Ranger':
              return 16;  // Send the ranger to id 16
            default:
              return 7;   // Default option for other classes (can be adjusted)
          }
        }
      }
    ]
  },
  {
    id: 7,
    text: 'While exploring the castle you come across the dragon in your path.',
    options: [
      {
        text: 'Try to run',
        nextText: (currentState) => {
          if (currentState.class === 'Rogue') {
            return 17;  // Send them to id 17 for Rogue-specific outcome
          } else if (currentState.class === 'Wizard') {
            return 20;  // Send them to id 20 for Wizard-specific outcome
          } else {
            return 8;   // Send them to id 8 for the default outcome
          }
        }
      },
      {
        text: 'Attack it with your sword',
        requiredState: (currentState) => currentState.inventory.includes('Sword'),
        nextText: 9
      },
      {
        text: 'Hide behind your shield',
        requiredState: (currentState) => currentState.inventory.includes('Shield'),
        nextText: 10
      },
      {
        text: 'Use the scales?',
        requiredState: (currentState) => currentState.scales,
        nextText: 11
      }
    ]
  },
  
  {
    id: 8,
    text: 'Your attempts to run are in vain and the dragon easily catches.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      },
      
    ],

  },
  {
    id: 9,
    text: 'You foolishly thought this dragon could be slain with a single sword.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 10,
    text: 'The dragon laughed as you hid behind your shield and ate you.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 11,
    text: 'You throw the dragon scales as he blasts you with fire, causing his scales to ignite and burn him to ash. Seeing your victory you decide to claim this castle as your and live out the rest of your days there.',
    options: [
      {
        text: 'Congratulations. Play Again.',
        nextText: -1
      }
    ]
  },
  {
    id: 12,
    text: 'As a Wizard, you discover a hidden spellbook in the castle library. This book grants you unimaginable power.',
    options: [
      {
        text: 'Study the spellbook',
        setState: { powerfulSpell: true },
        nextText: 13
      },
      {
        text: 'Ignore the spellbook',
        nextText: 7
      }
    ],
    requiredState: (currentState) => currentState.class === 'Wizard'
  },
  {
    id: 13,
    text: 'Armed with newfound magical abilities, you conquer the castle and become a legendary Wizard ruler.',
    options: [
      {
        text: 'Congratulations. Play Again.',
        nextText: -1
      }
    ],
    requiredState: (currentState) => currentState.powerfulSpell
  },

  // Additional events/endings for the Knight class
  {
    id: 14,
    text: 'As a Knight, you find a legendary sword hidden in the castle armory. This sword grants you unmatched strength.',
    options: [
      {
        text: 'Take the legendary sword',
        setState: { legendarySword: true },
        nextText: 15
      },
      {
        text: 'Leave the sword',
        nextText: 7
      }
    ],
    requiredState: (currentState) => currentState.class === 'Knight'
  },
  {
    id: 15,
    text: 'Empowered by the legendary sword, you vanquish the castle\'s evil dragon and become a renowned Knight in the kingdom.',
    options: [
      {
        text: 'Congratulations. Play Again.',
        nextText: -1
      }
    ],
    requiredState: (currentState) => currentState.legendarySword
  },

  // Additional events/endings for the Ranger class
  {id: 16,
  text: 'As a Ranger, you are able to track the dragon through the depths of the castle until he falls asleep.',
  options: [
    {
      text: 'Attack while he sleeps',
      setState: { legendarySword: true },
      nextText: 18
    },
    {
      text: 'Steal from his treasure',
      nextText: 19
    }
  ],
  requiredState: (currentState) => currentState.class === 'Ranger'
  },
  {
    id: 17,
    text: 'You find a hidden passage that leads you to the dragon\'s lair. The mighty dragon sleeps soundly on a bed of treasure.',
    options: [
      {
        text: 'Slay the dragon while it sleeps',
        requiredState: (currentState) => currentState.class === 'Knight' || currentState.class === 'Ranger',
        nextText: 18
      },
      {
        text: 'Steal from the dragon\'s horde',
        requiredState: (currentState) => currentState.class === 'Rogue',
        nextText: 19
      },
      {
        text: 'Leave the lair',
        nextText: 8
      }
    ]
  },
  {
    id: 18,
    text: 'With a swift and decisive strike, you slay the dragon in its sleep. The castle is now yours to command.',
    options: [
      {
        text: 'Congratulations. Play Again.',
        nextText: -1
      }
    ]
  },
  
  {
    id: 19,
    text: 'You carefully pilfer the dragon\'s horde, grabbing as much treasure as you can carry. The dragon remains undisturbed. The People will have to find someone else to save them.',
    options: [
      {
        text: 'You won, but at what cost?',
        nextText: -1
      }
    ]
  },
  {
  id: 20,
  text: 'As a Wizard, you cast a powerful invisibility spell and slip away unnoticed. The dragon searches in confusion.',
  options: [
    {
      text: 'Congratulations. Play Again.',
      nextText: -1
    }
  ],
  requiredState: (currentState) => currentState.class === 'Wizard'
},
{
  id: 21,
  text: 'You find a mysterious doorway leading deeper into the castle. You sense potential danger ahead.',
  options: [
    {
      text: 'Explore deeper',
      nextText: (currentState) => {
        switch (currentState.class) {
          case 'Wizard':
            return 12;  // Send the wizard to id 12
          case 'Knight':
            return 14;  // Send the knight to id 14
          case 'Rogue':
            return 17;  // Send the rogue to id 17
          case 'Ranger':
            return 16;  // Send the ranger to id 16
          default:
            return 8;   // Default option for other classes (can be adjusted)
        }
      }
    },
    {
      text: 'Leave before you get caught',
      nextText: 8  // Send to id 8 (default outcome)
    }
  ]
},

  // Additional events/endings for the Rogue class
  // ...
];

startGame()