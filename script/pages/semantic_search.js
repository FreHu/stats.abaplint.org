export class SemanticSearch {
  static render(owner, repo) {
    let full = `${owner}/${repo}`;

    document.getElementById("main").innerHTML = `<u>${full}</u><br><br>
    semantic search, wip
    `;
  }
}