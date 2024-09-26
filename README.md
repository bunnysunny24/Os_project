# **Post-Apocalyptic Survival Strategy Game**

## **Overview**
Welcome to the **Post-Apocalyptic Survival Strategy Game**, where players (or AI) find themselves stranded in a desolate world with limited resources. The goal? **Survive** by gathering resources like food, water, wood, and shelter materials while competing with others for these scarce supplies. Players must navigate a **grid-based map**, managing their hunger, thirst, and shelter needs while avoiding deadlock situations and negotiating alliances or engaging in combat.

---

## **Game Features**
- **Grid-based Map**: A strategic environment where players gather essential resources from shared spots like rivers, forests, food depots, and shelters.
- **Turn-based Gameplay**: Players take turns moving across the grid, gathering resources, and managing their survival.
- **Mutual Exclusion**: Only one player can collect a resource from a specific spot at a time, leading to competition and potential deadlock situations.
- **Deadlock Risk**: Players may get blocked if too many go for the same resource. Failure to resolve the deadlock can lead to resource shortages.
- **Negotiation & Combat**: Players can negotiate to share resources or fight for control of a resource spot.
- **Survival Mechanics**: Manage hunger, thirst, and shelter, or face health penalties and eventual elimination.
- **Victory Conditions**: The last surviving player or completing a shared objective like building a shelter wins the game.

---

## **Installation & Setup**

### **Prerequisites**
- Make sure you have **Node.js** and **npm** (Node Package Manager) installed on your machine.

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/post-apocalyptic-survival-game.git
   ```
2. Navigate into the project directory:
   ```bash
   cd post-apocalyptic-survival-game
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Start the game:
   ```bash
   npm start
   ```

---

## **How to Play**

### **Objective**
- Survive the longest by managing your resources or complete the common goal of building a shelter.

### **Turn-Based Actions**
- Move across the grid to gather resources.
- Negotiate or fight for control of resource spots.
- Manage your hunger, thirst, and shelter needs every turn.

### **Resource Spots**
- **River**: Collect water.
- **Forest**: Gather wood for shelter.
- **Food Depot**: Secure food to survive.
- **Shelter**: Build or maintain shelter to avoid health penalties.

---

## **Game Mechanics**

### **Mutual Exclusion**
- Only one player can gather a resource from a specific spot at a time. Players must anticipate each other's movements and strategize to outmaneuver their opponents.

### **Deadlock**
- If two players continuously block each other at a resource spot, a deadlock occurs. Both players lose valuable turns and health if they cannot resolve it by moving, negotiating, or fighting.

### **Negotiation/Combat**
- Players can negotiate resource-sharing deals or engage in combat to take control of a resource spot.

---

## **Example Round**
- **Round 1**: Player 1 moves to the river to collect water. Player 2 moves to the food depot. Player 3 and Player 4 both head to the forest, but Player 3 gathers wood first, leaving Player 4 blocked and losing a turn.
  
- **Round 2**: Player 4 moves to another resource spot, while Player 1 negotiates with Player 3 to alternate turns at the forest. Player 2 encounters a mini combat event while at the food depot.

---

## **Contributing**
If you would like to contribute to the game, feel free to submit a pull request. We welcome improvements to mechanics, bug fixes, new features, or feedback on gameplay balance!

---

## **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

