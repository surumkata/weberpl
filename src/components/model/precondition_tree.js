// Classe PreConditionTree
export class PreConditionTree {
  constructor(root) {
      this.root = root;
  }

  testTree(room, inventory, state) {
      return this.root.testNode(room, inventory, state);
  }
}

// Classe PreConditionNode
export class PreConditionNode {
  constructor(value, left = null, right = null, isOperator = false) {
      this.value = value;
      this.left = left;
      this.right = right;
      this.isOperator = isOperator;
  }

  testNode(room, inventory, state) {
      if (this.isOperator) {
          if (this.value === "and") {
              return this.left.testNode(room, inventory, state) && this.right.testNode(room, inventory, state);
          } else if (this.value === "or") {
              return this.left.testNode(room, inventory, state) || this.right.testNode(room, inventory, state);
          } else if (this.value === "not") {
              return !this.left.testNode(room, inventory, state);
          }
      } else {
          return this.value.test(room, inventory, state);
      }
  }
}

// Classes para Operadores Lógicos
export class PreConditionOperatorAnd extends PreConditionNode {
  constructor(left, right) {
      super("and", left, right, true);
  }
}

export class PreConditionOperatorOr extends PreConditionNode {
  constructor(left, right) {
      super("or", left, right, true);
  }
}

export class PreConditionOperatorNot extends PreConditionNode {
  constructor(left) {
      super("not", left, null, true);
  }
}

// Classe PreConditionVar
export class PreConditionVar extends PreConditionNode {
  constructor(value) {
      super(value);
  }

  test(room, inventory, state) {
      // Implemente a lógica específica para testar a variável em JavaScript
      // Exemplo: return room.checkIfConditionSatisfied(this.value);
      return true; // Exemplo simplificado
  }
}
