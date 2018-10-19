import sys
import pandas as pd

levels = {
    "[Expert]": 5,
    "[Experienced]": 4,
    "[Moderate]": 3,
    "[Beginner]": 2,
    "[Want to learn]": 1
}

cmd, input_path, output_path = sys.argv
df = pd.read_csv(input_path)
df = df[["Name", "Skills"]]

l = df.values.tolist()

def process_skills(name, str):
    """
    Gets a String like [Expert]: C#,C# application development,Catalan,Spanish;\n[Experienced]: Microsoft SQL ,SQL;:
    and converts to a list of pairs (Skill, level)

    Following the example:

    [("C#", 5), ..., ("SQL", 4)]
    """
    if type(str) == float:
        print(type(str), name)
        return []

    lines = str.split("\n")
    result = []

    for line in lines:
        level_str = line.split(":")[0]
        level = levels[level_str]

        skills = line[len(level_str)+ 1:].strip().split(",")
        result = result + [(name, skill.replace(";", "").strip(), level) for skill in skills]

    return result

flatten = lambda l: [item for sublist in l for item in sublist]

data = [process_skills(name, skills) for name, skills in l]
data = flatten(data)

all_skills = set([skill for name, skill, level in data ])

names = map(lambda row: row[0], data)
skills = map(lambda row: row[1], data)
level = map(lambda row: row[2], data)

## Create the pivot table
df = pd.DataFrame({"Name": list(names), "skill": list(skills), "expertise": list(level) })
df = df.pivot(index='Name', columns='skill', values='expertise')
df = df.reset_index()


## Add empty mail column
df["Email"] = ""

## Sort columns
df.reindex(columns = sorted(df.columns))

columns = df.columns.tolist()
columns = list(filter(lambda col: col not in ["Name", "Email"], columns))
columns = ["Email", "Name"] + columns
df = df.reindex(columns= columns)


df.to_csv(output_path, index=False)
