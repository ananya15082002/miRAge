import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer

# Step 1: Data Processing
df = pd.read_csv("athletes.csv")
df.dropna(subset=["Medal"], inplace=True)  # Remove rows with missing Medal values

df["Age"].fillna(df["Age"].mean(), inplace=True)
df["Height"].fillna(df["Height"].mean(), inplace=True)
df["Weight"].fillna(df["Weight"].mean(), inplace=True)
df["Medal"].fillna("None", inplace=True)
print(df["Medal"].value_counts())
df = df.drop(["ID", "Name", "Games"], axis=1)

from sklearn.preprocessing import LabelEncoder

def label_encoder(column):
    le = LabelEncoder().fit(column)
    #print(column.name, le.classes_)
    return le.transform(column)
cols = ["Sex", "NOC", "Season", "Team", "City", "Sport", "Event"]
for col in cols:
    df[col] = label_encoder(df[col])
to_num = ["Age", "Height", "Weight"]
for col in to_num:
    df[col] = df[col].astype("int64")
df["Medal"] = df["Medal"].map({
    "None": 0,
    "Gold": 1,
    "Bronze": 1,
    "Silver": 1
})
X = df.drop("Medal", axis=1)
y = df["Medal"]
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

from sklearn.preprocessing import MinMaxScaler

sc = MinMaxScaler()
X_train_scaled = sc.fit_transform(X_train)
X_test_scaled = sc.transform(X_test)
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier()
rf.fit(X_train_scaled, y_train)

y_pred = rf.predict(X_test_scaled)
from sklearn.metrics import accuracy_score

print(accuracy_score(y_test, y_pred))