export default function IslamicAnimatedBg() {
  return (
    <div className="islamic-bg" aria-hidden="true">
      {/* kiri atas */}
      <div className="islamic-motif motif-a">
        <svg viewBox="0 0 120 120" fill="none">
          <path
            d="M60 16
               L72 36
               L94 26
               L84 48
               L106 60
               L84 72
               L94 94
               L72 84
               L60 106
               L48 84
               L26 94
               L36 72
               L14 60
               L36 48
               L26 26
               L48 36
               Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <circle
            cx="60"
            cy="60"
            r="11"
            stroke="currentColor"
            strokeWidth="2.4"
          />
        </svg>
      </div>

      {/* kanan atas */}
      <div className="islamic-motif motif-b">
        <svg viewBox="0 0 120 120" fill="none">
          <path
            d="M60 18
               C68 30, 80 36, 96 36
               C84 44, 78 56, 78 70
               C70 58, 58 52, 44 52
               C56 44, 62 32, 60 18Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M102 60
               C90 68, 84 80, 84 96
               C76 84, 64 78, 50 78
               C62 70, 68 58, 68 44
               C76 56, 88 62, 102 60Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M60 102
               C52 90, 40 84, 24 84
               C36 76, 42 64, 42 50
               C50 62, 62 68, 76 68
               C64 76, 58 88, 60 102Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M18 60
               C30 52, 36 40, 36 24
               C44 36, 56 42, 70 42
               C58 50, 52 62, 52 76
               C44 64, 32 58, 18 60Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* kiri bawah */}
      <div className="islamic-motif motif-c">
        <svg viewBox="0 0 120 120" fill="none">
          <path
            d="M60 20
               L70 38
               L90 42
               L76 58
               L80 78
               L60 70
               L40 78
               L44 58
               L30 42
               L50 38
               Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M60 34
               L67 47
               L82 50
               L71 61
               L74 76
               L60 70
               L46 76
               L49 61
               L38 50
               L53 47
               Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* kanan bawah */}
      <div className="islamic-motif motif-d">
        <svg viewBox="0 0 120 120" fill="none">
          <rect
            x="28"
            y="28"
            width="64"
            height="64"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M60 18
               L70 34
               L86 44
               L70 54
               L60 70
               L50 54
               L34 44
               L50 34
               Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M102 60
               L86 70
               L76 86
               L66 70
               L50 60
               L66 50
               L76 34
               L86 50
               Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}