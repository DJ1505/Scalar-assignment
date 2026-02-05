const ROLES = {
  BACKEND: "Backend Engineer",
  FULL_STACK: "Full Stack Engineer",
  DATA_ENGINEER: "Data Engineer",
} as const

const BUCKETS = ["DSA", "System Design", "Core Programming", "Role Stack", "Projects / Experience"] as const

const BUCKET_KEYWORDS: Record<string, string[]> = {
  DSA: [
    "data structures",
    "algorithms",
    "dsa",
    "arrays",
    "linked list",
    "tree",
    "graph",
    "dynamic programming",
    "dp",
    "recursion",
    "sorting",
    "searching",
    "hash",
    "heap",
    "stack",
    "queue",
    "binary search",
    "bfs",
    "dfs",
    "leetcode",
    "hackerrank",
    "competitive programming",
  ],
  "System Design": [
    "system design",
    "scalability",
    "distributed",
    "microservices",
    "api design",
    "load balancing",
    "caching",
    "database design",
    "rest",
    "messaging",
    "queue",
    "cap theorem",
    "consistency",
    "availability",
    "latency",
    "throughput",
    "cdns",
    "sharding",
    "replication",
    "design patterns",
    "high level design",
    "hld",
    "lld",
  ],
  "Core Programming": [
    "python",
    "java",
    "javascript",
    "typescript",
    "go",
    "golang",
    "c++",
    "c#",
    "rust",
    "oop",
    "object oriented",
    "multithreading",
    "concurrency",
    "async",
    "memory management",
    "git",
    "debugging",
    "testing",
    "unit test",
    "code review",
    "clean code",
    "refactoring",
  ],
  "Role Stack": [],
  "Projects / Experience": [
    "project",
    "experience",
    "built",
    "developed",
    "implemented",
    "deployed",
    "years",
    "internship",
    "work experience",
    "portfolio",
    "github",
    "contributed",
    "led",
    "designed",
    "architected",
    "launched",
    "production",
    "real-world",
  ],
}

const ROLE_STACK_KEYWORDS: Record<string, string[]> = {
  [ROLES.BACKEND]: [
    "backend",
    "server",
    "node",
    "express",
    "django",
    "flask",
    "spring",
    "fastapi",
    "sql",
    "database",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "elasticsearch",
    "aws",
    "docker",
    "kubernetes",
    "ci/cd",
    "rest api",
    "graphql",
    "grpc",
    "authentication",
    "authorization",
    "jwt",
    "oauth",
    "message queue",
    "kafka",
    "rabbitmq",
  ],
  [ROLES.FULL_STACK]: [
    "frontend",
    "backend",
    "react",
    "vue",
    "angular",
    "next.js",
    "html",
    "css",
    "javascript",
    "node",
    "express",
    "full stack",
    "fullstack",
    "rest api",
    "database",
    "sql",
    "redux",
    "state management",
    "responsive",
    "ui",
    "ux",
    "typescript",
    "spa",
    "aws",
    "deployment",
    "docker",
    "vercel",
    "netlify",
  ],
  [ROLES.DATA_ENGINEER]: [
    "etl",
    "data pipeline",
    "spark",
    "airflow",
    "sql",
    "python",
    "data warehouse",
    "snowflake",
    "bigquery",
    "redshift",
    "kafka",
    "hadoop",
    "hive",
    "presto",
    "data modeling",
    "dimensional",
    "batch",
    "streaming",
    "dbt",
    "databricks",
    "data quality",
    "metadata",
    "data lake",
    "elt",
  ],
}

export interface SkillArea {
  skillArea: string
  expectedLevel: string
  yourLevel: string
  status: string
  score: number
  hits: number
  totalKeywords: number
}

export interface AnalysisResult {
  ok: boolean
  overallScore: number
  skillAreas: SkillArea[]
  weakAreas: string[]
  insight: string
  role: string
}

function getFrameworkForRole(role: string) {
  const roleStack = ROLE_STACK_KEYWORDS[role] || ROLE_STACK_KEYWORDS[ROLES.BACKEND]
  const keywords: Record<string, string[]> = {}
  for (const k in BUCKET_KEYWORDS) {
    keywords[k] = [...BUCKET_KEYWORDS[k]]
  }
  keywords["Role Stack"] = roleStack
  return { buckets: BUCKETS, keywords }
}

function normalizeText(text: string): string {
  return (text || "").toLowerCase().replace(/\s+/g, " ").trim()
}

function countKeywordHits(text: string, keywords: string[]): number {
  const normalized = normalizeText(text)
  let hits = 0
  for (const keyword of keywords) {
    if (normalized.includes(keyword.toLowerCase())) hits++
  }
  return hits
}

function hitsToLevel(hits: number, totalKeywords: number): string {
  if (totalKeywords === 0) return "Low"
  const ratio = hits / totalKeywords
  if (ratio >= 0.35) return "High"
  if (ratio >= 0.15) return "Medium"
  return "Low"
}

const EXPECTED_LEVEL = "High"

function levelToScore(level: string): number {
  if (level === "High") return 100
  if (level === "Medium") return 60
  return 25
}

function statusFromLevels(yourLevel: string, expectedLevel: string): string {
  if (yourLevel === "High") return "Good"
  if (yourLevel === "Medium" && expectedLevel === "High") return "Needs Work"
  if (yourLevel === "Medium") return "Good"
  return "Needs Work"
}

function analyzeSkills(text: string, role: string) {
  const framework = getFrameworkForRole(role)
  const { buckets, keywords: keywordMap } = framework
  const skillAreas: SkillArea[] = []
  let totalScore = 0
  const maxScore = buckets.length * 100

  for (const bucket of buckets) {
    const keywords = keywordMap[bucket] || []
    const hits = countKeywordHits(text, keywords)
    const yourLevel = hitsToLevel(hits, Math.max(keywords.length, 1))
    const expectedLevel = EXPECTED_LEVEL
    const status = statusFromLevels(yourLevel, expectedLevel)
    const bucketScore = levelToScore(yourLevel)
    skillAreas.push({
      skillArea: bucket,
      expectedLevel,
      yourLevel,
      status,
      score: bucketScore,
      hits,
      totalKeywords: keywords.length,
    })
    totalScore += bucketScore
  }

  const overallScore = Math.round((totalScore / maxScore) * 100)
  const clampedScore = Math.min(100, Math.max(0, overallScore))
  const weakAreas: string[] = []
  for (const area of skillAreas) {
    if (area.status === "Needs Work") weakAreas.push(area.skillArea)
  }

  return { role, overallScore: clampedScore, skillAreas, weakAreas }
}

function perturbScore(baseScore: number): number {
  const delta = Math.random() * 26 - 18
  const raw = baseScore + delta
  return Math.min(100, Math.max(0, Math.round(raw)))
}

function getInsight(role: string, weakAreas: string[]): string {
  const roleTips: Record<string, string> = {
    [ROLES.BACKEND]:
      "Most candidates fail Backend interviews due to weak DSA and System Design, not resume formatting.",
    [ROLES.FULL_STACK]:
      "Full Stack roles often screen for both problem-solving and hands-on project depth — gaps in either can hold you back.",
    [ROLES.DATA_ENGINEER]:
      "Data Engineering interviews focus on data modeling, pipelines, and SQL; missing fundamentals here is a common gap.",
  }
  const base = roleTips[role] || roleTips[ROLES.BACKEND]
  if (!weakAreas || weakAreas.length === 0) {
    return "Your profile aligns well with common expectations for this role. Focus on the areas above to stay sharp."
  }
  if (weakAreas.length <= 2) {
    return `Focus on ${weakAreas.join(" and ")} to improve your readiness for ${role} roles. ${base}`
  }
  return `${base} In your case, the main gaps are: ${weakAreas.slice(0, 3).join(", ")}.`
}

export function analyzeJobReadiness(text: string, role: string): AnalysisResult {
  const analysis = analyzeSkills(text, role)
  const insight = getInsight(role, analysis.weakAreas)
  const overallScore = perturbScore(analysis.overallScore)
  return {
    ok: true,
    overallScore,
    skillAreas: analysis.skillAreas,
    weakAreas: analysis.weakAreas,
    insight,
    role: analysis.role,
  }
}
