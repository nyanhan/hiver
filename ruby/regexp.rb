def chab(s)   # "contains hex in angle brackets"
    p (s =~ /<0(x|X)(\d|[a-f]|[A-F])+>/) != nil
end
chab "Not this one."

chab "Maybe this? {0x35}"    # wrong kind of brackets

chab "Or this? <0x38z7e>"    # bogus hex digit

chab "Okay, this: <0xfc0004>."

STDIN.gets