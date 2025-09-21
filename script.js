// Menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if(menuToggle){
  menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });
}

// Planner logic
function round(num){ return Math.round(num); }

function calculateBMR(gender, weightKg, heightCm, age){
  // Mifflin-St Jeor Equation
  if(gender === 'female'){
    return 10*weightKg + 6.25*heightCm - 5*age - 161;
  }
  return 10*weightKg + 6.25*heightCm - 5*age + 5;
}

function caloricRecommendation(bmr, goal){
  // sedentary baseline multiplier
  const maintenance = bmr * 1.3;
  if(goal === 'lose') return round(maintenance - 500); // deficit
  if(goal === 'gain') return round(maintenance + 300); // surplus
  return round(maintenance);
}

function generateMealPlan(calories, goal){
  // Simple macro splits and sample meals
  let proteinPerc = 30, carbPerc = 45, fatPerc = 25;
  if(goal === 'gain') proteinPerc = 35, carbPerc = 45, fatPerc = 20;
  if(goal === 'lose') proteinPerc = 35, carbPerc = 35, fatPerc = 30;

  const proteinCal = Math.round(calories * (proteinPerc/100));
  const carbCal = Math.round(calories * (carbPerc/100));
  const fatCal = Math.round(calories * (fatPerc/100));

  const proteinGr = Math.round(proteinCal / 4);
  const carbGr = Math.round(carbCal / 4);
  const fatGr = Math.round(fatCal / 9);

  return {
    calories, proteinPerc, carbPerc, fatPerc,
    proteinGr, carbGr, fatGr,
    meals: [
      {name: 'Breakfast', items: ['Oats or eggs', 'Fruit', 'Black coffee or tea']},
      {name: 'Lunch', items: ['Lean protein + rice/roti + veggies']},
      {name: 'Snack', items: ['Nuts / Greek yogurt / Protein shake']},
      {name: 'Dinner', items: ['Lean protein + salad/veggies']}
    ]
  };
}

function generateWorkoutPlan(pref, goal){
  // Simple templated plans
  const plans = {
    gym: {
      lose: ['3x/week - Full body (compound lifts) + 2 cardio sessions'],
      maintain: ['3-4x/week - Split (upper/lower) + 2 moderate cardio'],
      gain: ['4-5x/week - Hypertrophy split + progressive overload']
    },
    yoga: {
      lose: ['Daily 30-45min vinyasa + 3 brisk walks/week'],
      maintain: ['Daily 30-60min mixed yoga'],
      gain: ['Strength-focused yoga + resistance bands 3x/week']
    },
    cardio: {
      lose: ['5x/week - mix of HIIT and steady-state cardio'],
      maintain: ['3-4x/week - steady-state cardio'],
      gain: ['3x/week - cardio + strength training 3x/week']
    },
    crossfit: {
      lose: ['4-5x/week - WODs + calorie deficit'],
      maintain: ['4x/week - balanced WODs'],
      gain: ['4-5x/week - strength cycles + WODs']
    },
    home: {
      lose: ['5x/week - HIIT and bodyweight circuits'],
      maintain: ['3-4x/week - Full body bodyweight routines'],
      gain: ['4x/week - Bodyweight strength + resistance bands']
    }
  };
  return plans[pref] ? plans[pref][goal] : ['3x/week mixed plan'];
}

const generateBtn = document.getElementById('generateBtn');
if(generateBtn){
  generateBtn.addEventListener('click', () => {
    const age = Number(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = Number(document.getElementById('height').value);
    const weight = Number(document.getElementById('weight').value);
    const goal = document.getElementById('goal').value;
    const workoutPref = document.getElementById('workoutPref').value;

    if(!age || !height || !weight){
      alert('Please fill all fields');
      return;
    }

    const bmr = calculateBMR(gender, weight, height, age);
    const recCalories = caloricRecommendation(bmr, goal);
    const mealPlan = generateMealPlan(recCalories, goal);
    const workoutPlan = generateWorkoutPlan(workoutPref, goal);
    const bmi = (weight / ((height/100)*(height/100))).toFixed(1);

    const resultEl = document.getElementById('planResult');
    resultEl.innerHTML = `
      <h4>Your Body Status</h4>
      <p>BMI: <strong>${bmi}</strong> | BMR (est): <strong>${round(bmr)} kcal/day</strong> | Daily calories (suggested): <strong>${mealPlan.calories} kcal</strong></p>

      <h4>Macro Targets</h4>
      <p>Protein: <strong>${mealPlan.proteinGr}g</strong> (${mealPlan.proteinPerc}%) • Carbs: <strong>${mealPlan.carbGr}g</strong> (${mealPlan.carbPerc}%) • Fat: <strong>${mealPlan.fatGr}g</strong> (${mealPlan.fatPerc}%)</p>

      <h4>Sample Meal Plan</h4>
      ${mealPlan.meals.map(m=>`<strong>${m.name}</strong><p>${m.items.join(' • ')}</p>`).join('')}

      <h4>Workout Suggestion</h4>
      <p>${workoutPlan.join(' // ')}</p>

      <p style='color:#666;font-size:0.9rem;margin-top:0.5rem;'>Tip: Replace these sample meals with your own preferences. Use this as a starting guide.</p>
    `;
  });
}

// Accessibility: focus first input on planner page
if(document.getElementById('age')) document.getElementById('age').focus();