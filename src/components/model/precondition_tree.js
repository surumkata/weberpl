class PreConditionTree {
  constructor(root) {
    this.root = root;
  }

  test_tree(room, inventory) {
    return this.root.test_node(room, inventory);
  }

}

class PreConditionNode {
  constructor(value, left, right, is_operator = false) {
    this.value = value;
    this.left = left;
    this.right = right;
    this.is_operator = is_operator;
  }

  test_node(room, inventory) {
    if (this.is_operator) {
      if (this.value === "and") {
        return this.left.test_node(room, inventory) && this.right.test_node(room, inventory);
      } else {
        if (this.value === "or") {
          return this.left.test_node(room, inventory) || this.right.test_node(room, inventory);
        } else {
          if (this.value === "not") {
            return !this.left.test_node(room, inventory);
          }
        }
      }
    } else {
      return this.value.test(room, inventory);
    }
  }

}

class PreConditionOperatorAnd extends PreConditionNode {
  constructor(left, right) {
    super("and", left, right);
  }

}

class PreConditionOperatorOr extends PreConditionNode {
  constructor(left, right) {
    super("or", left, right);
  }

}

class PreConditionOperatorNot extends PreConditionNode {
  constructor(left) {
    super("not", left, null);
  }

}

class PreConditionVar extends PreConditionNode {
  constructor(value) {
    super(value, null, null);
  }

}
