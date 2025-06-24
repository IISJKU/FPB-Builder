/**
 * Crée les instances quand le DOM est chargé
 */

function RadioGroup(groupNode) {
  this.groupNode = groupNode;

  this.radioButtons = [];

  this.firstRadioButton = null;
  this.lastRadioButton = null;

  var rbs = this.groupNode.querySelectorAll('[role="radio"],[role="menuitemradio"]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = rbs[i];

    rb.addEventListener("keydown", this.handleKeydown.bind(this));
    rb.addEventListener("click", this.handleClick.bind(this));
    rb.addEventListener("focus", this.handleFocus.bind(this));
    rb.addEventListener("blur", this.handleBlur.bind(this));

    this.radioButtons.push(rb);

    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
}
RadioGroup.prototype.setChecked = function (currentItem) {
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.setAttribute("aria-checked", "false");
    rb.classList.remove("checked");
    rb.classList.add("unchecked");
    rb.tabIndex = -1;
  }
  currentItem.setAttribute("aria-checked", "true");
  currentItem.classList.add("checked");
  currentItem.classList.remove("unchecked");
  triggerMouseEvent(currentItem, "mousedown");
  triggerMouseEvent(currentItem, "mouseup");

  currentItem.tabIndex = 0;
  currentItem.focus();
};

RadioGroup.prototype.setCheckedToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstRadioButton) {
    this.setChecked(this.lastRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index - 1]);
  }
};

RadioGroup.prototype.setCheckedToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastRadioButton) {
    this.setChecked(this.firstRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index + 1]);
  }
};

/* EVENT HANDLERS */

RadioGroup.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false;
  console.log(event.key, event.target);

  switch (event.key) {
    case " ":
      this.setChecked(tgt);
      flag = true;
      break;

    case "Up":
    case "ArrowUp":
    case "Left":
    case "ArrowLeft":
      this.setCheckedToPreviousItem(tgt);
      flag = true;
      break;

    case "Down":
    case "ArrowDown":
    case "Right":
    case "ArrowRight":
      this.setCheckedToNextItem(tgt);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

RadioGroup.prototype.handleClick = function (event) {
  this.setChecked(event.currentTarget);
};

RadioGroup.prototype.handleFocus = function (event) {
  // event.currentTarget.classList.add('focus');
};

RadioGroup.prototype.handleBlur = function (event) {
  // event.currentTarget.classList.remove('focus');
};
