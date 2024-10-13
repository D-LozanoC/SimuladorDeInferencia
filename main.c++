#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>

using namespace std;

class Rule {
public:
    vector<string> conditions;
    string conclusion;

    Rule(vector<string> conds, string concl) : conditions(conds), conclusion(concl) {}
};

class ForwardChaining {
private:
    unordered_map<string, bool> facts;
    vector<Rule> rules;

public:
    void addFact(string fact) {
        facts[fact] = true;
    }

    void addRule(Rule rule) {
        rules.push_back(rule);
    }

    void infer() {
        bool newFactAdded;
        do {
            newFactAdded = false;
            for (const auto& rule : rules) {
                bool allConditionsMet = true;
                for (const auto& condition : rule.conditions) {
                    if (facts.find(condition) == facts.end() || !facts[condition]) {
                        allConditionsMet = false;
                        break;
                    }
                }
                if (allConditionsMet && facts.find(rule.conclusion) == facts.end()) {
                    facts[rule.conclusion] = true;
                    newFactAdded = true;
                    cout << "New fact inferred: " << rule.conclusion << endl;
                }
            }
        } while (newFactAdded);
    }

    void printFacts() {
        cout << "Facts:" << endl;
        for (const auto& fact : facts) {
            cout << fact.first << endl;
        }
    }
};

int main() {
    ForwardChaining fc;
    fc.addFact("A");
    fc.addFact("B");

    fc.addRule(Rule({"A", "B"}, "C"));
    fc.addRule(Rule({"C"}, "D"));


    fc.infer();
    fc.printFacts();
    int c;
    cout<<"Enter a number";
    cin>>c;
    cout<<"This is the number: "<<c;
    return 0;
}
