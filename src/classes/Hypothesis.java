package classes;

import java.util.Arrays;

public class Hypothesis {
    public Fact fact;
    public SingleLinkedList<Condition> conditions;

    public Hypothesis(Fact fact, Condition[] conditions) {
        this.fact = fact;
        this.conditions = new SingleLinkedList<>(Arrays.asList(conditions));
    }

    @Override
    public String toString() {
        return fact.toString();
    }
}