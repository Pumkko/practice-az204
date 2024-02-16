using System.Text.Json.Serialization;

namespace pumkko.bikerepairshop;


public record Pages
{
    [JsonPropertyName("page_name")]
    public required string PageName { get; set; }

    [JsonPropertyName("title")]
    public required string Title { get; set; }

    [JsonPropertyName("action")]
    public required string Action { get; set; }
}

public record Repository
{
    [JsonPropertyName("name")]
    public required string Name { get; set; }
}

public record GithubGollumnEvent
{
    [JsonPropertyName("pages")]
    public required IEnumerable<Pages> Pages { get; set; }

    [JsonPropertyName("repository")]
    public required Repository Repository { get; set; }
}