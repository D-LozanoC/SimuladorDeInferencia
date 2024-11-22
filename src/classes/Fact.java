package classes;

public class Fact {
    public String attribute;
    public String value;

    public Fact(String attribute, String value) {
        this.attribute = attribute;
        this.value = value;
    }

    @Override
    public String toString() {
        return attribute + " = " + value;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Fact fact = (Fact) obj;
        return attribute.equals(fact.attribute) && value.equals(fact.value);
    }
}
