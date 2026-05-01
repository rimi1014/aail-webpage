// ══════════════════════════════════════════════════════════════
//  PUBLICATIONS DATA
//  논문 추가는 이 파일만 수정하면 됩니다.
//
//  각 논문 필드:
//    type    : "journal" | "conference" | "preprint"
//    year    : 연도 문자열 (예: "2026"). Preprint는 "Preprints" 로 작성.
//    title   : 논문 제목
//    authors : 저자 목록 (약식)
//    venue   : 학술지/학회명. 학술지명은 <em>태그</em>로 감싸기.
//
//  ⚠️  최신 논문이 위에 오도록 추가하세요.
// ══════════════════════════════════════════════════════════════

const PUBLICATIONS = [

  // ── Preprints ──────────────────────────────────────────────
  { type: "preprint", year: "Preprints",
    title: "Combinatorial Safety-Critical Coordination of Multi-Agent Systems via Mixed-Integer Responsibility Allocation and Control Barrier Functions",
    authors: "J. Autenrieb, M. Spiller, H.-S. Shin, N. Cho",
    venue: "arXiv:2603.05762, March 2026" },

  { type: "preprint", year: "Preprints",
    title: "Data-Driven Hamiltonian for Direct Construction of Safe Set from Trajectory Data",
    authors: "J. J. Choi, C. A. Strong, K. Sreenath, N. Cho, C. J. Tomlin",
    venue: "arXiv:2504.03233, April 2025" },

  { type: "preprint", year: "Preprints",
    title: "Synchronisation-Oriented Design Approach for Adaptive Control",
    authors: "N. Cho, S. Lee, H.-S. Shin",
    venue: "arXiv:2403.09179, March 2024" },

  { type: "preprint", year: "Preprints",
    title: "A Passivity-Based Method for Accelerated Convex Optimisation",
    authors: "N. Cho, H.-S. Shin",
    venue: "arXiv:2306.11474, June 2023" },

  // ── Journal Papers ─────────────────────────────────────────
  { type: "journal", year: "2026",
    title: "Dual-Stage Risk-Aware Predictive Control System for Terrain Following Using Unmanned Aircraft with Rangefinders",
    authors: "P. Padilla, N. Cho, A. Tsourdos",
    venue: "<em>Control Engineering Practice</em>, Vol. 173, No. 106961" },

  { type: "journal", year: "2025",
    title: "Command Governor for Impact-Angle Guidance to Fast Targets under Field-of-View Constraint",
    authors: "S. Lee, N. Cho, H.-S. Shin",
    venue: "<em>Aerospace Science and Technology</em>, Vol. 167, No. 110695" },

  { type: "journal", year: "2025",
    title: "Generalized Time-to-Go Inversion Guidance with Impact Time and Angle Constraints",
    authors: "P. Wang, C.-H. Lee, N. Cho, B. Wie",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 48, No. 3, pp. 555–574" },

  { type: "journal", year: "2024",
    title: "Online Corrections to Neural Policy Guidance for Pinpoint Powered Descent",
    authors: "N. Cho, H.-S. Shin, A. Tsourdos, D. Amato",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 47, No. 5, pp. 945–963" },

  { type: "journal", year: "2024",
    title: "Approximation of Achievable Robustness Limit Based on Sensitivity Inversion",
    authors: "N. Cho, H.-I. Lee",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 47, No. 1, pp. 143–155" },

  { type: "journal", year: "2024",
    title: "Analytic Approach for Impact Time Guidance with Look Angle Constraint Using Exact Time-to-Go Solution",
    authors: "S. Lee, J. Kim, Y. Kim, N. Cho",
    venue: "<em>Journal of Aerospace Engineering</em>, Vol. 37, No. 2, pp. 04023118" },

  { type: "journal", year: "2023",
    title: "Three-Dimensional Guidance Method with Course Modification for Altitude Shaping in Endoatmospheric Interception",
    authors: "N. Cho",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 59, No. 6, pp. 9775–9791" },

  { type: "journal", year: "2023",
    title: "Data-Efficient Active Weighting Algorithm for Composite Adaptive Control Systems",
    authors: "S.-H. Kim, H. Lee, N. Cho, Y. Kim",
    venue: "<em>IEEE Transactions on Automatic Control</em>, Vol. 68, No. 5, pp. 3086–3090" },

  { type: "journal", year: "2023",
    title: "Three-Dimensional Biased Proportional Navigation Guidance Based on Spatial Rotation of Predicted Final Velocity",
    authors: "N. Cho, S. Lee, H.-S. Shin, T.-H. Kim",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 59, No. 2, pp. 1354–1370" },

  { type: "journal", year: "2022",
    title: "Generalized Analysis of Biased Proportional Navigation Guidance with Fractional Power Error Feedback",
    authors: "N. Cho, J. Kim, S. Lee, Y. Kim",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 45, No. 9, pp. 1598–1613" },

  { type: "journal", year: "2022",
    title: "Unified Control Parametrisation Approach for Finite-Horizon Feedback Control with Trajectory Shaping",
    authors: "N. Cho, J. Park, Y. Kim, H.-S. Shin",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 58, No. 5, pp. 4782–4795" },

  { type: "journal", year: "2021",
    title: "Analysis of Guidance Laws With Nonmonotonic Line-of-Sight Rate Convergence",
    authors: "S. Lee, N. Cho, H.-S. Shin",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 58, No. 2, pp. 1029–1041" },

  { type: "journal", year: "2021",
    title: "Look-Angle-Constrained Control of Arrival Time with Exact Knowledge of Time-to-Go",
    authors: "N. Cho, S. Lee",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 44, No. 10, pp. 1902–1908" },

  { type: "journal", year: "2021",
    title: "Quadratic Optimisation of Initial State for Dynamic Controller in Linear Systems",
    authors: "N. Cho, Y. Kim",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 57, No. 2, pp. 1361–1370" },

  { type: "journal", year: "2020",
    title: "Schwarz Inequality Method for Weighted Minimum Effort Terminal Control of Multi-Dimensional Systems",
    authors: "N. Cho, Y. Kim, C.-H. Lee",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 43, No. 10, pp. 1893–1903" },

  { type: "journal", year: "2020",
    title: "Wind Compensation Framework for Unpowered-Aircraft Using Online Waypoint Correction",
    authors: "N. Cho, S. Lee, J. Kim, Y. Kim, S. Park, C. Song",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 56, No. 1, pp. 698–710" },

  { type: "journal", year: "2020",
    title: "Generalised Formulation of Linear Non-quadratic Weighted Optimal Error Shaping Guidance Laws",
    authors: "N. Cho, Y. Kim, H.-S. Shin",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 43, No. 6, pp. 1143–1153" },

  { type: "journal", year: "2019",
    title: "Analysis of Missile Longitudinal Autopilot Based on the State-Dependent Riccati Equation Method",
    authors: "J. Lee, N. Cho, Y. Kim",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 42, No. 10, pp. 2183–2196" },

  { type: "journal", year: "2018",
    title: "Composite Model Reference Adaptive Control with Parameter Convergence under Finite Excitation",
    authors: "N. Cho, H.-S. Shin, Y. Kim, A. Tsourdos",
    venue: "<em>IEEE Transactions on Automatic Control</em>, Vol. 63, No. 3, pp. 811–818" },

  { type: "journal", year: "2016",
    title: "Optimality of Augmented Ideal Proportional Navigation for Maneuvering Target Interception",
    authors: "N. Cho, Y. Kim",
    venue: "<em>IEEE Transactions on Aerospace and Electronic Systems</em>, Vol. 52, No. 2, pp. 948–954" },

  { type: "journal", year: "2016",
    title: "Modified Pure Proportional Navigation Guidance Law for Impact Time Control",
    authors: "N. Cho, Y. Kim",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 39, No. 4, pp. 852–872" },

  { type: "journal", year: "2015",
    title: "Three-Dimensional Nonlinear Differential Geometric Path-Following Guidance Law",
    authors: "N. Cho, Y. Kim, S. Park",
    venue: "<em>Journal of Guidance, Control, and Dynamics</em>, Vol. 38, No. 12, pp. 2366–2385" },

  // ── Conference Papers ──────────────────────────────────────
  { type: "conference", year: "2026",
    title: "Cascaded Control Barrier Function Method for Safe Spacecraft Rendezvous",
    authors: "J. Woo, Y. Kim, N. Cho, S. Lee",
    venue: "8th CEAS EuroGNC Conference, Madrid, Spain" },

  { type: "conference", year: "2026",
    title: "Sum of Squares for Region of Attraction Estimation with Parallel Computing and Multiple Shape Functions",
    authors: "A. Ibrahim, N. Cho, V. Renganathan, B. Biswas, D. Ignatyev",
    venue: "15th UKACC International Conference on Control, Newcastle, UK" },

  { type: "conference", year: "2025",
    title: "Data-Driven Hamiltonian for Direct Construction of Safe Set from Trajectory Data",
    authors: "J. J. Choi, C. A. Strong, K. Sreenath, N. Cho, C. J. Tomlin",
    venue: "64th IEEE Conference on Decision and Control, Rio de Janeiro, Brazil" },

  { type: "conference", year: "2024",
    title: "A Passivity-Based Method for Accelerated Convex Optimisation",
    authors: "N. Cho, H.-S. Shin",
    venue: "63rd IEEE Conference on Decision and Control, Milan, Italy" },

  { type: "conference", year: "2024",
    title: "Π-ORFit: One-Pass Learning with Bregman Projection",
    authors: "N. Cho, Y. Min, H.-S. Shin, N. Azizan",
    venue: "43rd American Control Conference, Toronto, Canada" },

  { type: "conference", year: "2024",
    title: "Recursive Least Squares with Log-Determinant Divergence Regularisation for Online Inertia Identification",
    authors: "N. Cho, T. Lee, H.-S. Shin",
    venue: "41st IEEE ICRA, Yokohama, Japan" },

  { type: "conference", year: "2023",
    title: "Composite Model Reference Adaptive Control under Finite Excitation with Unstructured Uncertainties",
    authors: "N. Cho, H.-S. Shin, Y. Kim, A. Tsourdos",
    venue: "62nd IEEE Conference on Decision and Control, Singapore" },

  { type: "conference", year: "2021",
    title: "Nonlinear Optimal Missile Guidance for Stationary Target Interception with Pendulum Motion Perspective",
    authors: "N. Cho",
    venue: "40th American Control Conference, Virtual (New Orleans, LA, USA)" },

  { type: "conference", year: "2020",
    title: "Feasible Initial Conditions for Bias Proportional Navigation Guidance Laws Under Look Angle Constraints",
    authors: "N. Cho, J. Kim, S. Lee",
    venue: "28th Mediterranean Conference on Control and Automation, Virtual" },

  { type: "conference", year: "2019",
    title: "Field-of-View-Constrained Impact Angle Control Guidance with Error Convergence Before Interception",
    authors: "J. Kim, N. Cho, Y. Kim",
    venue: "Guidance, Navigation, and Control Conference, AIAA SciTech, San Diego, CA, USA" },

  { type: "conference", year: "2018",
    title: "Missile Guidance Based on Tracking of Predicted Target Trajectory",
    authors: "S. Lee, N. Cho, Y. Kim",
    venue: "26th Mediterranean Conference on Control and Automation, Zadar, Croatia" },

  { type: "conference", year: "2017",
    title: "Generalization of Linearly Parametrized Trajectory Shaping Guidance Laws",
    authors: "N. Cho, Y. Kim, H.-S. Shin",
    venue: "20th IFAC World Congress, Toulouse, France" },

];
