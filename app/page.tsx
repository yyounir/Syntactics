import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Syntactics</h1>
      <p>Pick a mode from the sidebar to get started.</p>
      <p>
        <Link href="/leetcode">Go to LeetCode Mode &rarr;</Link>
      </p>
    </div>
  );
}
