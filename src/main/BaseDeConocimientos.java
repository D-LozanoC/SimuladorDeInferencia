package main;

/**
 *
 * @author Andres
 */
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

class Fact {

    String attribute;
    String value;

    public Fact(String attribute, String value) {
        this.attribute = attribute;
        this.value = value;
    }

    @Override
    public String toString() {
        return attribute + " = " + value;
    }
}

class Condition extends Fact {

    public Condition(String attribute, String value) {
        super(attribute, value);
    }
}

class Hypothesis {

    Fact fact;
    SingleLinkedList<Condition> conditions;

    public Hypothesis(Fact fact, Condition[] conditions) {
        this.fact = fact;
        this.conditions = new SingleLinkedList<>(Arrays.asList(conditions));
    }

    @Override
    public String toString() {
        return fact.toString();
    }
}

class SingleLinkedList<T> {

    Node<T> head;

    public SingleLinkedList(List<T> list) {
        for (T item : list) {
            addLast(item);
        }
    }

    private void addLast(T item) {
        Node<T> newNode = new Node<>(item);
        if (head == null) {
            head = newNode;
        } else {
            Node<T> current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        Node<T> current = head;
        while (current != null) {
            sb.append(current.data).append(" ");
            current = current.next;
        }
        return sb.toString();
    }

    public Iterator<T> iterator() {
        return new Iterator<T>() {
            Node<T> current = head;

            public boolean hasNext() {
                return current != null;
            }

            public T next() {
                T data = current.data;
                current = current.next;
                return data;
            }
        };
    }

    private static class Node<T> {

        T data;
        Node<T> next;

        public Node(T data) {
            this.data = data;
        }
    }
}

class DoubleLinkedList<T> {

    Node<T> head;
    Node<T> tail;

    public void addLast(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            newNode.prev = tail;
            tail = newNode;
        }
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        Node<T> current = head;
        while (current != null) {
            sb.append(current.data).append(" ");
            current = current.next;
        }
        return sb.toString();
    }

    private static class Node<T> {

        T data;
        Node<T> next;
        Node<T> prev;

        public Node(T data) {
            this.data = data;
        }
    }
}

public class BaseDeConocimientos {

    static ArrayList<Fact> facts = new ArrayList<>();
    static ArrayList<Hypothesis> hypotheses = new ArrayList<>();
    static DoubleLinkedList<Hypothesis> hypothesisList = new DoubleLinkedList<>();

    public static void main(String[] args) {
        try {
            // Leer hechos desde el archivo "hechos.txt"
            BufferedReader factsReader = new BufferedReader(new FileReader("hechos.txt"));
            String line;
            while ((line = factsReader.readLine()) != null) {
                String[] parts = line.split(" ");
                if (parts.length == 2) {
                    facts.add(new Fact(parts[0], parts[1]));
                }
            }
            factsReader.close();

            // Leer hipótesis desde el archivo "hipotesis.txt"
            BufferedReader hypothesesReader = new BufferedReader(new FileReader("hipotesis.txt"));
            while ((line = hypothesesReader.readLine()) != null) {
                String[] parts = line.split(" ");
                if (parts.length >= 3 && (parts.length - 2) % 2 == 0) {
                    String attribute = parts[0];
                    String value = parts[1];
                    Fact fact = new Fact(attribute, value);
                    List<Condition> conditions = new ArrayList<>();
                    boolean validHypothesis = true;
                    for (int i = 2; i < parts.length; i += 2) {
                        Condition condition = new Condition(parts[i], parts[i + 1]);
                        if (condition.attribute.equals(attribute) && condition.value.equals(value)) {
                            validHypothesis = false;
                            break;
                        }
                        conditions.add(condition);
                    }
                    if (validHypothesis) {
                        Hypothesis hypothesis = new Hypothesis(fact, conditions.toArray(new Condition[0]));
                        hypotheses.add(hypothesis);
                        hypothesisList.addLast(hypothesis);
                    } else {
                        System.out.println("La regla (" + fact + " -> " + conditions.toString() + ") no se ha podido añadir al grafo debido a que una de las condiciones es la misma hipótesis.");
                    }
                }
            }
            hypothesesReader.close();

            System.out.println("Hechos:");
            for (Fact fact : facts) {
                System.out.println(fact);
            }
            System.out.println("\nHipótesis:");
            for (Hypothesis hypothesis : hypotheses) {
                System.out.print(hypothesis + " -> ");
                Iterator<Condition> conditionIterator = hypothesis.conditions.iterator();
                while (conditionIterator.hasNext()) {
                    Condition condition = conditionIterator.next();
                    System.out.print(condition);
                    if (conditionIterator.hasNext()) {
                        System.out.print(" -> ");
                    }
                }
                System.out.println();
            }

            Scanner scanner = new Scanner(System.in);
            System.out.println("\nIngrese la hipótesis para el encadenamiento hacia atrás (hipotesis valor):");
            String input = scanner.nextLine();
            String[] parts = input.split(" ");
            if (parts.length == 2) {
                Hypothesis targetHypothesis = new Hypothesis(new Fact(parts[0], parts[1]), new Condition[0]);
                boolean isValid = backwardChaining(targetHypothesis, new ArrayList<>(), new ArrayList<>());

                if (isValid) {
                    System.out.println("La hipótesis " + targetHypothesis.fact + " es válida.");
                } else {
                    System.out.println("La hipótesis " + targetHypothesis.fact + " no es válida.");
                }
            } else {
                System.out.println("Formato inválido para la hipótesis.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static boolean backwardChaining(Hypothesis targetHypothesis, ArrayList<Hypothesis> appliedRules, ArrayList<Hypothesis> solutionPath) {
        for (Hypothesis hypothesis : hypotheses) {
            if (hypothesis.fact.attribute.equals(targetHypothesis.fact.attribute)
                    && hypothesis.fact.value.equals(targetHypothesis.fact.value)) {
                if (appliedRules.contains(hypothesis)) {
                    // Ciclo infinito
                    return false;
                }
                appliedRules.add(hypothesis);
                solutionPath.add(hypothesis);
                boolean allConditionsSatisfied = true;

                Iterator<Condition> conditionIterator = hypothesis.conditions.iterator();
                while (conditionIterator.hasNext()) {
                    Condition condition = conditionIterator.next();
                    boolean conditionSatisfied = false;
                    for (Fact fact : facts) {
                        if (condition.attribute.equals(fact.attribute) && condition.value.equals(fact.value)) {
                            conditionSatisfied = true;
                            break;
                        }
                    }
                    if (!conditionSatisfied) {
                        conditionSatisfied = backwardChaining(new Hypothesis(condition, new Condition[0]), appliedRules, solutionPath);
                    }
                    if (!conditionSatisfied) {
                        allConditionsSatisfied = false;
                        break;
                    }
                }
                if (allConditionsSatisfied) {
                    printAppliedRules(solutionPath);
                    return true;
                } else {
                    appliedRules.remove(hypothesis);
                    solutionPath.remove(hypothesis);
                }
            }
        }
        return false;
    }

    private static void printAppliedRules(ArrayList<Hypothesis> solutionPath) {
        int ruleCount = 1;
        for (int i = solutionPath.size() - 1; i >= 0; i--) {
            Hypothesis hypothesis = solutionPath.get(i);
            System.out.print("R" + ruleCount + ". ");
            if (hypothesis.conditions.head == null) {
                System.out.println(hypothesis.fact);
            } else {
                System.out.print("Si ");
                Iterator<Condition> conditionIterator = hypothesis.conditions.iterator();
                while (conditionIterator.hasNext()) {
                    Condition condition = conditionIterator.next();
                    System.out.print(condition);
                    if (conditionIterator.hasNext()) {
                        System.out.print(" y ");
                    }
                }
                System.out.println(", entonces " + hypothesis.fact + ".");
            }
            ruleCount++;
        }
    }
    
    

    private static boolean isHypothesisValid(Hypothesis hypothesis, ArrayList<Hypothesis> appliedRules) {
        Iterator<Condition> conditionIterator = hypothesis.conditions.iterator();
        while (conditionIterator.hasNext()) {
            Condition currentCondition = conditionIterator.next();
            boolean conditionSatisfied = false;
            for (Fact fact : facts) {
                if (currentCondition.attribute.equals(fact.attribute) && currentCondition.value.equals(fact.value)) {
                    conditionSatisfied = true;
                    break;
                }
            }
            if (!conditionSatisfied) {
                for (Hypothesis otherHypothesis : hypotheses) {
                    if (otherHypothesis.fact.attribute.equals(currentCondition.attribute)
                            && otherHypothesis.fact.value.equals(currentCondition.value)
                            && !appliedRules.contains(otherHypothesis)) {
                        appliedRules.add(otherHypothesis);
                        if (isHypothesisValid(otherHypothesis, appliedRules)) {
                            conditionSatisfied = true;
                            break;
                        } else {
                            appliedRules.remove(otherHypothesis);
                        }
                    }
                }
            }
            if (!conditionSatisfied) {
                return false;
            }
        }
        return true;
    }

}
